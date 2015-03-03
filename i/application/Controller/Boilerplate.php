<?php

class Controller_Boilerplate extends Controller_FilesystemBase{
	
	public function __construct(){
		parent::__construct("boilerplate", [
			'path' => "patterns/"
		]);
	}

}

?>