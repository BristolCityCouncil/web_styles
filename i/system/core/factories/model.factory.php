<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class Model extends Blackgrid{
	

	private $model = array();
	private $_defaultConfig = array();

	public function __construct($model = array(), $config = array()){
		$this->model = $model;
		$this->config = $config;

		parent::__construct();
	}
	private function config($item){
		if(array_key_exists($item, $this->config)){
			return $this->config[$item];
		}else if(array_key_exists($item, $this->_defaultConfig)){
			return $this->_defaultConfig[$item];
		}else{
			return false;
		}
	}
	public function fetch(){
		return $this->model; // from database
	}

}

?>