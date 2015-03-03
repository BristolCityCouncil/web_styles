<?php

class Controller_Boilerplateold extends Controller_FilesystemBase{

	public function __construct(){
		parent::__construct("boilerplate_old", [
			'path' => "workspace/"
		]);
	}


}

?>