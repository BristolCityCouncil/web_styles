<?php

class Domain_Builder {

	const BUILDTYPE = 'DIR';

	public function saveStaticController($controller){
		print "<h2>" . $controller['folder'] . "</h2>\n";
		foreach($this->getControllerFolders($controller) as $folder => $files) {
			if(!is_array($files)){
				$controller['folder'] = isset($controller['folder'])? $controller['folder'] : false ;
				$controller['path'] = isset($controller['path'])? $controller['path'] : false ;
				$this->saveStaticControllerMethod(
					$controller['name'], 
					$controller['folder'], 
					$controller['path'], 
					false, 
					$files
				);
			}else{
				foreach($files as $file) {
					//print "<h3>" . $file . "</h3>";
					$this->saveStaticControllerMethod(
						$controller['name'],
						$controller['folder'],
						$controller['path'], 
						$folder,
						$file
					);
				}
			}
		}
	}

	public function saveStaticControllerMethod($controller, $folder, $dest_folder, $sub_folder="index", $file=null){

		$static = $this->runController($controller, $folder, $sub_folder, $file);

		//print_fr(["controller" => $controller, "folder" => $folder,"sub" => $sub_folder, "file" => $file, strlen($static)]);

		// if(!is_dir(SITE_PATH . "/dest/$dest_folder/")){
		// 	mkdir(SITE_PATH . "/dest/$dest_folder/", 0777, true);
		// }
		$this->saveDestFile($dest_folder, $sub_folder, $file, $static);
	}

	public function saveDestFile($folder, $sub_folder, $name, $contents){
		if(!is_dir(SITE_PATH . "/dest/$folder/$sub_folder")){
			mkdir(SITE_PATH . "/dest/$folder/$sub_folder", 0777, true);
		}

		if($sub_folder){
			$sub_folder .= "/";
		}

		if(self::BUILDTYPE == 'DIR'){
			if($sub_folder == "index"){
				if($folder){
					$folder .= "/";
				}
				file_put_contents(SITE_PATH . "/dest/" . $folder . "index.html", $contents);
				print "Created... <strong>/dest/" . $folder . "index.html </strong><br/>\n";
				return;
			}
			if($name != "index"){
				if(!is_dir(SITE_PATH . "/dest/$folder/$sub_folder/$name")){
					mkdir(SITE_PATH . "/dest/$folder/$sub_folder/$name", 0777, true);
				}
				$ext = "/index.html";
				file_put_contents(SITE_PATH . "/dest/$folder/" . $sub_folder ."$name" . $ext, $contents);
				print "Created... <strong>/dest/$folder/" . $sub_folder ."$name" . $ext . "</strong><br/>\n";
			}else{
				file_put_contents(SITE_PATH . "/dest/$folder/" .$sub_folder ."index.html", $contents);
				print "Created... <strong>/dest/$folder/" .$sub_folder ."index.html</strong><br/>\n";
			}
		}
		if(self::BUILDTYPE == 'HTML'){
			if($sub_folder == "index"){
				file_put_contents(SITE_PATH . "/dest/$folder.html", $contents);
				print "Created... <strong>/dest/$folder.html </strong><br/>\n";
			}
			if($name != "index"){
				$ext = ".html";
				file_put_contents(SITE_PATH . "/dest/$folder/" . $sub_folder . "$name" . $ext, $contents);
				print "Created... <strong>/dest/$folder/" . $sub_folder . "$name" . $ext ."</strong><br/>\n";
			}else{
				file_put_contents(SITE_PATH . "/dest/$folder/" . $sub_folder . "index.html", $contents);
				print "Created... <strong>/dest/$folder/" . $sub_folder . "index.html </strong><br/>\n";
			}
		}
	}

	public function runController($controller, $folder, $file="index", $method=false){
		ob_start();

		$controller = "Controller_" . $controller;
		$c = new $controller();		
		$c->get($file, $method);

		$static = ob_get_contents();
		
		ob_end_clean();
		return $static;
	}
	public function getControllerFolders($controller){
		return $dir = $this->dirToArray(SITE_PATH . '/templates/' . $controller['folder']);
	}
	public function getAvailableFolders(){
		$dir = array_keys($this->dirToArray(SITE_PATH . '/templates'));
		$structure = [];
		foreach($dir as $d){
			if(!is_int($d) && $d!= "builder"){
				$structure[] = $d;
			}
		}
		return $structure;
	}

	public function getAvailableControllers($subset = false){
		$controllers = $this->getControllers($subset);
		$meta = [];
		foreach($controllers as $controller){
			$reflection = new ReflectionClass("Controller_" . $controller);
			$meth = $reflection->getMethod('__construct');
			$matches = [];
			$match = preg_match_all("/\* @([A-Za-z]+)[ ]+([A-Za-z_\-\/\ ]+)/", $meth->getDocComment(), $matches);

			$mag = [];
			foreach($matches[0] as $k => $m){
				$mag[$matches[1][$k]] = trim($matches[2][$k]);
			}
			if(!empty($mag)){
				$mag['name'] = $controller;
				$mag['reflection'] = $reflection;
				$meta[] = $mag;
			}
		}
		return $meta;
	}

	public function getControllers($subset = false){
		if($subset){
			return array_keys($subset);
		}
		$dir = $this->dirToArray(SITE_PATH . '/i/application/Controller');
		$structure = [];
		foreach($dir as $d){
			if(!is_int($d) && $d!= "Builder"){
				$structure[] =  $d;
			}
		}
		return $structure;	
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