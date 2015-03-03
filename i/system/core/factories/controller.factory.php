<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class Controller extends Blackgrid{

	public $View, $Model;

	public function __construct(){
		parent::__construct();
		global $loader;
		$this->View = new Registry();
		$this->Model = new Registry();
		$this->loader = $loader;
	}

	public function __bind(){
		Controller::__construct();
	}
	public function navigate($path = ''){
		if($path[0]!="/"){
			$path = '/' . $path;
		}
		header('location: //' . $_SERVER['HTTP_HOST'] . $path);
	}
	public function getView($view, $construct = null){
		$_classname = "View_" . $view;
		return new $_classname($construct);
	}

	public function View($view, $construct = null){
		$_classname = "View_" . $view;
		self::$__registry['views'][$view] = (isset(self::$__registry['views'][$view])) ? self::$__registry['views'][$view] : new $_classname($construct);
		$this->View->add($view, self::$__registry['views'][$view]);
	}

}

?>