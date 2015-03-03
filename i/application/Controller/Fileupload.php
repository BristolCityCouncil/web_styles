<?php

class Controller_Fileupload extends Controller{
	public function __construct(){
		parent::__bind();
	}
	public function post(){
		if(in_array("application/octet-stream", $_FILES['files']['type'])){
			echo json_encode([
				"error" => "Invalid format"
			]);
		}else{
			 echo json_encode([
				"success" => "Uploaded"
			]);
		}
	}
}




?>