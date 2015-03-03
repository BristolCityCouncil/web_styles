<?php

abstract class Controller_FilesystemBase extends Controller {

	public function __construct($dir, $options = []){
		$this->dir = $dir;
		$this->json = (isset($options['json'])) ? $options['json'] : $this->json ;
		$this->path = (isset($options['path'])) ? $options['path'] : $this->path ;
		$this->header = (isset($options['header'])) ? $options['header'] : $this->header ;
		$this->footer = (isset($options['footer'])) ? $options['footer'] : $this->footer ;
		parent::__bind();
	}
	public $path = "patterns/";
	public $dir = "patterns";
	public $json = "templates/data.json";
	public $header = "chrome/header";
	public $footer = "chrome/footer";
	public function dirOverride(){
		return false;
	}
	public function get($folder = false, $file = "index"){
		$directory = ($this->dirOverride()) ? $this->dirOverride() : SITE_PATH . '/templates/'.$this->dir;
		$scanned_directory = $this->dirToArray($directory);
		$this->scanned_directory = $scanned_directory;
		
		if(!$folder){
			return $this->renderTemplate();
		}
		$this->renderTemplate($folder, $file);

	}
	public function pretty($string){
		return ucfirst(preg_replace('/_/', ' ', $string));

	}
	public function prettyPage($pages){
		foreach($pages as $key => $page){
			$pages[$key] = [ 'label' => $this->pretty($page) , 'path' => $page ];
		}
		return $pages;
	}
	public function renderTemplate($folder = false, $template = 'index', $js=false){
		$page_name = $template;
		$template = $folder ? $folder . DIRECTORY_SEPARATOR . $template : $template;
		try{
			$this->template = $this->Mustache->loadTemplate("/".$this->dir."/" . $template);
			$passed = $this->scanned_directory;
			$np = [];
			foreach($passed as $key => $val) {
				if(!is_int($key)){
					$ar = array('name' => $key, 'label'=> $this->pretty($key), 'path'=> $this->path, 'pages' => $this->prettyPage($val));
					if($key == $folder){
						$ar['active'] = true;
					}else {
						$ar['active'] = false;
					}
					$np[] = $ar;
				}
			}
			// if($folder){
			// 	$json[$folder] = $this->loadJson("json/" . $this->dir . "/" . $folder);
			// }else{
			// 	$json = array();
			// }
			//print_fr($folder);exit;
			//exit;
			$store = $this->compileJson();

			// /print_fr($np);exit;

			$page_json = (isset($store[$this->dir][$folder])) ? $store[$this->dir][$folder] : [] ;

			$header = array_merge([
				'menu' => $np, 
				'current' => $folder, 
				'path' => $this->path,
				'page' => $page_json,
			] ,$store);

			if($this->header){

				$h = $this->Mustache->loadTemplate("/".$this->header);

				echo $h->render($header);
			}


			$body = array_merge([
				'folders' => $np, 
				"current" => [
					"title" => $this->pretty($page_name),
				],
				'page' => $page_json,
				'header' => $header
			], $page_json,$store);

			if($folder && isset($store[$folder])){
				$body['page'] = $store[$folder];
			}
			if($this->template){
				echo $this->template->render($body);		
			}else{
				echo "This template is corrupt";
			}
			if($this->footer){
				$f = $this->Mustache->loadTemplate("/".$this->footer);
				echo $f->render($header);
			}

		} catch(Exception $e) { echo "Template for pattern does not exist"; }
	}
	public function loadTags(){

		if(is_dir(SITE_PATH . "/i/application/cache/json/tags")){
			mkdir(SITE_PATH . "/i/application/cache/json/", true);
		}

		$cache = $this->loadJson("i/application/cache/json/tags");
		$changed = filemtime(SITE_PATH . "/json/tags/.");
		$changed_time = (isset($cache->changed)) ? $cache->changed : 0 ;

		if($changed_time && $changed == $changed_time){
			return $cache->data;
		}

		$files = $this->dirToArray(SITE_PATH . "/json/tags");
		
		$json = [];
		
		foreach($files as $file){
			$json[$file] = $this->loadJson("json/tags/".$file);
		}
		
		file_put_contents(SITE_PATH . "/i/application/cache/json/tags.json", json_encode([
			"changed" => $changed,
			"data" => $json,
		]));
		
		return $json;

	}

	public function compileJson(){
		$cache = $this->cacheR("store");

		if(!$cache['changed']){
			return $cache['data'];
		}

		$files = $this->dirToArray(SITE_PATH . "/json");
		$store = [];
		foreach($files as $key => $v){
			//$d = $this->compileDirectoryJson($key);
			$store[$key] = $this->compileDirectoryJson($key);
		}

		$this->cacheS("store", $cache['changed'], $store);
		// print_fr($store);
		return $store;

	}

	public function compileDirectoryJson($dir){
		$cache = $this->cacheR($dir, $dir . "/");
		if(!$cache['changed']){
			return $cache['data'];
		}

		$files = $this->dirToArray(SITE_PATH . "/json/" . $dir);
		
		$json = [];
		
		foreach($files as $file){
			$json[$file] = $this->loadJson("json/" .$dir. "/".$file);
		}

		$this->cacheS($dir, $cache['changed'], $json);

		return $json;

	}

	public function cacheR($cache, $path = false){
		if($path == false){
			if(is_dir(SITE_PATH . "/json/cache")){
				rename(SITE_PATH . "/json/cache", SITE_PATH . "/i/application/cache/json");
			}
			$cache = $this->loadJson("i/application/cache/json/" . $cache);
			$files = $this->dirToArray(SITE_PATH . "/i/application/cache/json");
			$most = 0;
			foreach($files as $k){
				$dir = SITE_PATH . "/json/" . $k . "";
				if(is_dir($dir)){
					$changed = filemtime($dir . "/.");
					$most = ($most > $changed) ? $most : $changed ;
				}
			}
			$changed = $most;
		}else{
			$cache = $this->loadJson("i/application/cache/json/" . $cache);
			$changed = filemtime(SITE_PATH . "/json/" . $path . ".");
		}
		$changed_time = (isset($cache['changed'])) ? $cache['changed'] : 0 ;
		if($changed == $changed_time){
			return ["data" => $cache['data'], "changed" => false];
		}
		return ["data"=>false, "changed" => $changed];
	}
	public function cacheS($cache, $changed, $json){
		file_put_contents(SITE_PATH . "/i/application/cache/json/" . $cache . ".json", json_encode([
			"changed" => $changed,
			"data" => $json,
		]));
	}

	public function loadJson($json){
		$file = SITE_PATH . '/'.$json.".json";
		if(!file_exists($file)){
			file_put_contents($file, "{ }");
		}
		return json_decode(file_get_contents($file), true);
	}
	
	public function dirToArray($dir) { 
   
	   $result = array(); 

	   $cdir = scandir($dir); 
	   foreach ($cdir as $key => $value) 
	   { 
	      if (!in_array($value,array(".",".."))) 
	      { 
	         if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
	         { 

	            $result[$value] = $this->dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
	         } 
	         else 
	         { 
	            $result[] = preg_replace('/\\.[^.\\s]{3,4}$/', '', $value); 
	         } 
	      } 
	   } 
	   
	   return $result; 
	} 


}