<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class View extends Blackgrid {

	public $model;
	public function __construct(){
		parent::__construct();
		$_class = explode('_', get_called_class());
		$_class = array_slice($_class,1);
		$_class = implode('/', $_class);
		try {
			$_class = (isset($_class)) ? $_class : false;
			$this->template = $this->Mustache->loadTemplate($_class);
		} catch(Exception $e){
			$this->template = false;
		}
		$this->model = null;
	}
	public function render($vars = null){
		$vars = ($vars) ? $vars : $this->model;
		if($this->template){
			IO::Stream($this->template->render($vars));
		}
	}
}

?>