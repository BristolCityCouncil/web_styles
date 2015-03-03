<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");



class Collection extends Blackgrid {

	private $collection = [];
	private $_defaultConfig = [
		'Model' => 'Model',
	];

	public function __construct($collection, $config = []){
		$this->collection = $collection;
		$this->config = $config;

		$this->Model = $this->config('Model');
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

	public function Model($data = [],$fetch = false){
		if($fetch){
			$model = new $this->Model($data);
			$model->fetch();
			return $model;
		}
		return new $this->Model($data);
	}

	public function first($fetch = false){
		return $this->Model($this->collection[0], $fetch);
	}

}



/*
	Usage:

		$locations = new Collection([ -Array of models- ]);
		$locations // returns the original array
		$locations->first() // returns first model

	Backbone Implementation Checklist

	each ( fn ) // loops through each
	map ( fn ) // returns new array using function
	filter ( fn ) // returns only if true is returns on each iteration
	sortBy ( fn ) // sort function, returns 0-1a-zA-Z characters then ordered using them

*/