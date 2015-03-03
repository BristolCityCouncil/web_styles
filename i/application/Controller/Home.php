<?php

class Controller_Home extends Controller_FilesystemBase{

	/**
	 * @folder home 
	 * @path 
	 */
	public function __construct(){
		parent::__construct("home", [
			"path" => "/",
			"header" => "chrome/home-header",
			"footer" => "chrome/home-footer"
		]);
	}
	
}




?>