<?php

class Controller_ExampleProject extends Controller_FilesystemBase {
	/**
	 * @path example/project
	 * @folder project
	 */
	public function __construct(){
		parent::__construct("project", [
			"path" => "project",
			"header" => false,
			"footer" => false
		]);
	}


}

?>