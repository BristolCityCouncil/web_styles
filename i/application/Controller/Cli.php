<?php

class Controller_Cli {

	public function __construct(){

	}

	public function get($command = null){
		$builder = new Domain_Builder();
		if($command){
			return $this->{$command}();
		}
	}
	public function common(){
		$builder = new Domain_Builder();
		$controllers = $builder->getAvailableControllers();
		foreach($controllers as $controller){
			$builder->saveStaticController($controller);
		}
		$this->static_files();
	}
	public function custom(){
		$this->common();
	}

	public function static_files(){
		$this->recurse_copy(SITE_PATH . "/css", SITE_PATH . "/dest/css");
		$this->recurse_copy(SITE_PATH . "/bcc-beta-theme", SITE_PATH . "/dest/bcc-beta-theme");
		$this->recurse_copy(SITE_PATH . "/images", SITE_PATH . "/dest/images");
		$this->recurse_copy(SITE_PATH . "/fonts", SITE_PATH . "/dest/fonts");
	}

	public function log($message){
		fwrite(STDOUT, $message);
	}
	public function recurse_copy($src,$dst) { 
	    $dir = opendir($src); 
	    @mkdir($dst); 
	    while(false !== ( $file = readdir($dir)) ) { 
	        if (( $file != '.' ) && ( $file != '..' )) { 
	            if ( is_dir($src . '/' . $file) ) { 
	                $this->recurse_copy($src . '/' . $file,$dst . '/' . $file); 
	            } 
	            else { 
	                copy($src . '/' . $file,$dst . '/' . $file); 
	            } 
	        } 
	    } 
	    closedir($dir); 
	} 
}