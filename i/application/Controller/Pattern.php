<?php

class Controller_Pattern extends Controller_FilesystemBase{

	/**
	 * @folder patterns 
	 * @path patterns
	 */
	public function __construct(){
		parent::__construct("patterns", [
			"path" => "patterns/"
		]);
	}
	
}




?>