<?php

	/**
	 * Class Handlebars
	 * @package Blackgrid\Library\Adapters
     */
	class Handlebars {


		/**
		 * @param array $options
         */
		public function __construct($options = []){
			$this->options = $options;
			$this->options['flags'] = LightnCandy::FLAG_HANDLEBARSJS | LightnCandy::FLAG_RUNTIMEPARTIAL;
			if(isset($_GET['debug'])){
				$this->options['flags'] = LightnCandy::FLAG_MUSTACHE | LightnCandy::FLAG_RUNTIMEPARTIAL | LightnCandy::FLAG_HANDLEBARSJS;
			}
		    $this->templateDir = (isset($options['templateDir'])) ? $options['templateDir'] : SITE_PATH . "/templates" ;
			$this->addTemplateDirectory($this->templateDir);
			$this->addTemplateExtension(".html"); // defaults
		}

		/**
		 * @param $template
		 * @return bool|callable|false
		 *
		 * In development just render using the temp stuff
         */
		public function loadTemplate($template){
			$file = $this->templateDir . "/" . $template . ".html";
			
			if(!file_exists($file))
				return false;

			$template = file_get_contents($file);
			$phpStr = LightnCandy::compile($template, $this->options);
			$renderer = LightnCandy::prepare($phpStr);
			return new Tashproxy($renderer);
		}

		/**
		 * @param $template
		 * @return bool|callable|false
         */
		public function getTemplate($template){
			$file = $this->templateDir . "/" . $template . ".html";
			
			if(!file_exists($file))
				return false;
			
			$template = file_get_contents($this->templateDir . "/" . $template . ".html");
			$phpStr = LightnCandy::compile($template, $this->options);
			$renderer = LightnCandy::prepare($phpStr);
			return new Tashproxy($renderer);
		}

		/**
		 * @param $template
		 * @param array $data
		 * @return bool|callable|false
         */
		public function render($template, $data = []){
			$template = $this->loadTemplate($template);
			// if($template){
			// 	IO::Stream($template($data));
			// }else{
			// 	echo "template error, check file paths and extensions";
			// }
			return $template;
		}


		/**
		 * This will recursivly render all templates before prod.
		 * Should be linked to a build process (/build + password)
         */
		public function renderAll(){

		}

		/**
		 *
         */
		public function clearRenderedTemplates(){

		}

		/**
		 * @param $option
		 * @param $value
         */
		private function pushOption($option, $value){
			if(is_array($value)){
				foreach($value as $arr){
					$this->pushOption($option, $arr);
				}
				return;
			}
			if(!isset($this->options[$option]))
				$this->options[$option] = [];
			$this->options[$option][] = $value;
		}

		/**
		 * @param $dir
         */
		public function addTemplateDirectory($dir){
			$this->pushOption('basedir', $dir);
		}

		/**
		 * @param $ext
         */
		public function addTemplateExtension($ext){
			$this->pushOption('fileext', $ext);
		}


	}


class Tashproxy {


	public function __construct($ins){
		$this->ins = $ins;
	}
	public function render($options) {
		//$ins = $this->ins;
		//print_fr($ins);exit;
		if(is_callable($this->ins)){
			return call_user_func($this->ins, $options);
		}else{
			return "This template is corrupt.";
		}
		//return $ins($options);
	}

}

?>