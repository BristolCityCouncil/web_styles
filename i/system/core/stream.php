<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class IO {
	
	public static $stream = array();
	private static $json = array();
	public static $returnJSON = false;

	public function __construct(){
		
	}

	public static function stream($data, $static=false){
		$id = rtrim(base64_encode(md5(microtime())),"=");
		self::$stream[$id] = $data;
		return $id;
	}

	public static function streamJSON($data, $silent=false){
		// $id = rtrim(base64_encode(md5(microtime())),"=");
		if(!$silent){
			self::$returnJSON = true;
		}
		self::$json = array_merge(self::$json, $data);
	}

	public static function update($id, $data){
		if(array_key_exists($id, self::$stream)){
			self::$stream[$id] = $data;
		}
		return $id;
	}

	public function remove($id){
		if(array_key_exists($id, $this->stream)){
			unset($this->stream[$id]);
			return 1;
		}
		return 0;
	}

	public function get($id){
		if(array_key_exists($id, $this->stream)){
			return $this->stream[$id];
		}
		return 0;
	}
	public static function flushJSON(){
		if(isset($_POST["X-Requested-With"]) && $_POST["X-Requested-With"]=="IFrame"){
			self::$json = array_merge(self::$json, array( "ok" => "true" ) );
			return '<textarea data-type="application/json">' . json_encode(self::$json) . '</textarea>';	
		}else{
		  header("Access-Control-Allow-Origin: *");
		  header('Content-Type: application/json');
		  return json_encode(self::$json);
		}
	}
	public static function flush(){
		return implode("", self::$stream);
	}
}

?>