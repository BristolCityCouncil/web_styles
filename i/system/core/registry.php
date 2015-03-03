<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class Registry {
	public function add($name, $value){
		$this->{$name} = $value;
	}
}

?>