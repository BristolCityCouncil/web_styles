<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class Blackgrid {
	
	public static $__registry = array(
		'views' => array(),
		'models' => array(),
		'libraries' => array(),
		'plugins' => array(),
	);

	public function __construct(){
		$this->Mustache = new Handlebars();
		// $this->Mustache = new Mustache_Engine(array(
		// 	'cache' => SITE_PATH . '/i/application/cache/template',
		// 	'cache_file_mode' => 0666,
		// 	'loader' => new Mustache_Loader_FilesystemLoader(SITE_PATH.'/templates', array('extension' => '.html')),
		//   	'partials_loader' => new Mustache_Loader_FilesystemLoader(SITE_PATH.'/templates', array('extension' => '.html')),
		// ));
		$this->library = new Registry();
	}

	public function Library($library, $construct=array()){
		$_classname = "Library_" . $library;
		self::$__registry['libraries'][$library] = (isset(self::$__registry['libraries'][$library])) ? self::$__registry['libraries'][$library] : new $_classname($construct);
		$this->library->{$library} = self::$__registry['libraries'][$library];
	}
	public function getLibrary($library, $construct=array()){
		$_classname = "Library_" . $library;
		return new $_classname($construct);
	}
	public function getModel($model, $construct = null){
		$_classname = "Model_" . $model;
		return new $_classname($construct);
	}

	public function Model($model, $construct = null){
		$_classname = "Model_" . $model;
		self::$__registry['models'][$model] = (isset(self::$__registry['models'][$model])) ? self::$__registry['models'][$model] : new $_classname($construct);
		$this->Model->{$model} = self::$__registry['models'][$model];
	}
}

?>