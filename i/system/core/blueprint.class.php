<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

class Blueprint extends Model{

	protected $joins, $params, $index_params;
	public $table;

	public function __construct($table, $default_params=array()){
		parent::__construct();
		$this->database = $this->Library('database');
		$this->auth = $this->getLibrary('auth');
		$this->table = $table;
		$this->params = $default_params;
		$this->index_params = (is_array($this->index_params)) ? $this->index_params : array() ;
		$this->protected_params = (isset($this->protected_params) && is_array($this->protected_params)) ? $this->protected_params : array() ;
		$this->collection_params = (isset($this->collection_params) && is_array($this->collection_params)) ? $this->collection_params : $this->local_params ;
		$this->model_params = (isset($this->model_params) && is_array($this->model_params)) ? $this->model_params : $this->local_params ;
		$this->id_length = (isset($this->id_length)) ? $this->id_length : false ;
		/* pagination */
		$this->url = (isset($this->url)) ? $this->url : false;
		$this->permlink = (isset($this->permlink)) ? $this->permlink : false;
		if($this->url && !$this->permlink){
			$this->permlink = 'http://' . $_SERVER['HTTP_HOST'] .'/'. $this->url;
		}
		$this->api_path = (isset($this->api_path)) ? $this->api_path : false;
		$this->uri = '';
		$default_perpage = 48;
		//$default_perpage = 12;
		$this->pagination = (isset($this->pagination)) ? $this->pagination : array();
		$this->pagination['perpage'] = (isset($this->pagination['perpage'])) ? $this->pagination['perpage'] : $default_perpage ;
		//$this->library->database->setReturn("array");

		$this->defaults = array(
			"from_table" => $this->table, // default
			"from_col" => false, // required
			"to_table" => $table,
			"to_col" => "id",
			"leftjoin_override" => false,
			"dependancies" => array(), // dependancies to other joins
			"validation" => false,
			"post_join" => false,
			"cols" => false,
			"object" => false,
			"object_name" => false,
		);
		$this->joinRegistry = array();

		if(isset($_REQUEST['q'])){
			$queries = explode(",",$_REQUEST['q']);
			$where = array();
			foreach($queries as $que){
				$temp = explode(':', $que);
				if(in_array($temp[0], $this->search_params)){
					$where[] = $temp[0] . " LIKE '%" . $temp[1] . "%'";
				}
			}
			$this->uri = "&q=" . $_REQUEST['q'];
			IO::streamJSON(array("search" => "1"));
			$this->where($where);
		}

		if(isset($_POST['columns'])){
			$cols = explode(",", $_POST['columns']);
			$search = array_unique(array_intersect($cols, $this->local_params));
			$this->cols($search);
		}else{
			$this->cols($this->dot( array($this->table => $this->local_params) ) );
		}
		if(!isset($this->params['where'])){ $this->params['where'] = array(); }
		$this->postWhere();
		// $this->params['cols'] = array_merge($this->params['cols'], $this->dot( array($this->table => $this->local_params) ) );
	}

	public function __call($method, $args){
		$split_method = explode("_", $method);
		if(isset($split_method[0]) && $split_method[0]=="join" && isset($split_method[1])) {
			$this->_join($split_method[1], $args);
		}
	}
	public function activity($id, $label, $action){
		$activity = new Model_Activity();
		$activity->insert(array(
			"staff_id" => $this->auth->uid,
			"action" => $action,
			"resource_label" => $label,
			"resource_id" => $id,
			"resource_table" => $this->table,
		));
	}

	public function postWhere(){
		foreach($this->index_params as $index){
			if(isset($_REQUEST[$index])){
				$this->where(array(
					$index => $this->protect($_REQUEST[$index])
				));
			}
		}
		IO::StreamJSON(array("index_params" => $_POST), true);
	}

	public function protect($f){
		return $f;
	}

	private function one_to_many($table){
		if (substr($table, -1) == 's')
		{
    	$id = substr($table, 0, -1);
		}
		$this->_join($table, array(
			"from_col" => $id . "_id",
		));
		return $this;
	}

	private function _join($table, $args){
		$args[] = array();
		$return = false;
		if(!array_key_exists($table, $this->joins)){
			throw new Exception("The table join '$table' does not exists", 1);
		}
		if(isset($this->joinRegistry[$table]) && $this->joinRegistry[$table]){ return; }
		$this->joinRegistry[$table] = true;
		$join = array_merge(array_merge($this->defaults, $this->joins[$table]), $args[0]);
		if($join['validation']){
			$fn = call_user_func(array($this, $join['validation']), $table, $join);
			$join = ($fn) ? $fn : $join;
		}
		if(!$join['from_col']){
			throw new Exception("from_col required", 1);
		}
		if($join['object']){
			if(!$join['object_name']){
				$join['object_name'] = $join['to_table'];
			}
			$col = array();
			foreach($join['object'] as $va){
				$col[] = $table . "." . $va ." as '". $table . "." . $va ."'";
			}
			$this->params['cols'] = array_merge($this->params['cols'], $col);
			unset($col);
		}
		$this->_LeftJoin();
		foreach($join['dependancies'] as $dependancy){
			if($dependancy == $table){
				throw new Exception("Circular dependancy in '$dependancy'", 1);
			}
			$this->_join($dependancy, $this->joins[$dependancy]);
		}
		if($join['leftjoin_override']){
			$this->params['leftjoin'][] = $join['leftjoin_override'];
		}else{
			$this->params['leftjoin'][] = array($join['from_table'] . "." . $join['from_col'], $join['to_table'] . "." . $join['to_col']);
		}
		if($join['post_join']){
			$pfn = call_user_func(array($this, $join['post_join']), $table, $join);
			$return = ($pfn) ? $pfn : false;
			if($return){
				return $return;
			}
		}
		if($join['cols']){
			$this->_Cols();
			if(is_array($join['cols'])){
				$this->params['cols'] = array_merge($this->params['cols'], $join['cols']);
			}else{
				$this->params['cols'][] = $join['cols'];
			}
		}
		$this->joins[$table] = $join;
		return $this; //default chaining
	}
	public function objectify(&$input, $key, $object, $index=1){
		if(is_array($object)){
			$rename = $object[1];
			$object = $object[0];
		}else{
			$rename = $object;
		}
		$keys = array_keys($input);
		//$keys = preg_grep("/" . $object . "\./i", $keys);
		$result = array_intersect_key($input, array_flip(preg_grep("/" . $object . "\./i", array_keys($input), 0)));
		// print_Fr($result);
		$new = array();
		foreach($result as $key => $value){
			if($index || $value!==null){
				$temp = explode($object . '.', $key);
				$temp = $temp[1];
				$new[$temp]= $value;
			}
			unset($input[$key]);
		}
		$input[$rename] = $new;
		return $input;
	}
	protected function _Cols(){
		(!isset($this->params['cols'])) ? $this->params['cols']=array() : false;
	}
	protected function _LeftJoin(){
		$this->params['groupby'] = $this->table . ".id";
		(!isset($this->params['leftjoin'])) ? $this->params['leftjoin']=array() : false;
		$this->_ColsAdv();
	}
	protected function _ColsAdv(){
		(!isset($this->params['cols_adv'])) ? $this->params['cols_adv']=array() : false;
	}

	/* Actions */

	public function collection($page=false){
		$page = (isset($_GET['page'])) ? $_GET['page'] : 1;
		if($this->pagination['perpage']){
			$this->limit($this->pagination['perpage']);
			if($page){
				$offset = ($page-1) * $this->pagination['perpage'];
				$this->limit($offset . ',' . ($this->pagination['perpage']+1));
			}
		}
		if(!empty($this->collection_params)){
			$this->cols($this->dot( array($this->table => $this->collection_params) ), true);
		}
		$return = array();
		$return['models'] =  $this->library->database->get($this->table, $this->params);
		if(isset($return['models'][$this->pagination['perpage']])){
			unset($return['models'][$this->pagination['perpage']]);
			if($this->api_path){
				$return['next_page'] = $this->api_path . '?page=' . ($page+1) . $this->uri;
			}else{
				$return['next_page'] = $page+1;
			}
		}else{
			$return['next_page'] = false;
		}
		if($page > 1){
			if($this->api_path){
				if($page==2){
					$return['prev_page'] = $this->api_path;
				}else{
					$return['prev_page'] = $this->api_path . '?page=' . ($page-1) . $this->uri;
				}
			}else{
				$return['prev_page'] = $page-1;
			}
		}else{
			$return['prev_page'] = false;
		}
		if(isset($this->joins)){
			foreach ($this->joins as $join){
				if(isset($join['parse']) && is_callable($join['parse'])){
					$return['models'] = array_map($join['parse'], $return['models']);
				}
				//print_Fr($join);
				if(isset($join['object'])){
					array_walk($return['models'], array(&$this, "objectify") , array($join['to_table'], $join['object_name']));
				}
			}
		}
		$return = $this->parse_collection($return);
		return $return;
	}
	public function model($id, $col="id"){
		if(!is_array($id)){
			$where = array($this->table . "." . $col => $id);
		}else{
			$where = $id;
		}
		$params = $this->params;
		$this->where($where);
		if(!empty($this->model_params)){
			$this->cols($this->dot( array($this->table => $this->model_params) ));
		}
		$this->params['limit'] = 1;
		$model = $this->library->database->get($this->table, $this->params);
		if(empty($model)){ return; }
		IO::streamJSON(array("created_at" => $model[0]['created_at'], "updated_at" => $model[0]['created_at']), true);
		if(isset($this->joins)){
			foreach ($this->joins as $join){
				if(isset($join['parse']) && is_callable($join['parse'])){
					$model[0] = call_user_func($join['parse'], $model[0]);
				}
				if(isset($join['object'])){
					$model[0] = $this->objectify($model[0], '', array($join['to_table'], $join['object_name']));
				}
			}
		}
		return $model[0];
	}

	public function prepare(&$data, $insert=false){
		$data = array_intersect_key($data, array_flip($this->local_params));
		// intersect again for permissions (future?)
		if(in_array("updated_at", $this->local_params)){
			$data['updated_at'] = date('Y-m-d H:i:s');
		}
		if($insert){
			if($this->id_length){
				$data['id'] = generateID($this->id_length);
			}
			if(in_array("slug", $this->local_params)){
				$data['slug'] = "someslug!";
			}
			if(in_array("staff_id", $this->local_params)){
				if($this->auth->is_logged_in()){
					$data['staff_id'] = $this->auth->uid;
				}
			}
			if(in_array("client_id", $this->local_params)){
				if($this->auth->is_logged_in()){
					$data['client_id'] = $this->auth->client_id;
				}
			}

			if(in_array("created_at", $this->local_params)){
				$data['created_at'] = date('Y-m-d H:i:s');
			}
		}
		return $data;
	}
	public function insert($data){
		$this->prepare($data, true);
		$data = $this->library->database->insert($this->table, $data);
		return $data;
	}
	public function update($id, $data, $col="id"){
		$this->prepare($data);
		$data = array_diff_key($data, array_flip($this->protected_params));
		// $data = array_filter($data);
		$this->library->database->update($this->table, $data, array($col => $id));
		return $this->get($id);
	}

	/* RESTful METHODS */
	/*
	 * GET
	 * GET(id)
	 * POST
	 * POST(id) - 404?
	 * PUT(id)
	 * PATCH(id)
	 * DELTE(id)
	 *
	 * NOTE: all can be overriden with before_{method} instead of the actual function.
	 */
	public function get($id=false , $sub_resource=false){
		$this->before_get();
		if($id){
			$this->before_get_model($id);
			IO::streamJSON($this->model($id));
		}else{
			$this->before_get_collection();
			IO::streamJSON($this->collection());
		}
	}
	public function request_body(){
		if(isset($_POST["X-Requested-With"]) && $_POST["X-Requested-With"]=="IFrame"){
			return $_POST;
		}
		return json_decode(file_get_contents('php://input'), true);
	}
	public function post($id=false, $data=false){
		if($id){
			return $this->put($id, $data);
		}
		$request_body = $data ? $data : $this->request_body();
		$data = $this->before_post($request_body);
		$data = $this->insert($data);
		$data = $this->after_post($data['id'], $data);
		IO::streamJSON($data);
	}
	public function put($id, $data = false){
		$request_body = $data ? $data : $this->request_body();
		$data = $this->before_put($id, $request_body);
		$data = $this->update($id, $data);
		$data = $this->model($id);
		IO::streamJSON($data);
	}
	public function patch($id, $data = false){
		$request_body = $data ? $data : $this->request_body();
		$data = $this->before_patch($id, $request_body);
		$data = $this->update($id, $data);
		$data = $this->model($id);
		IO::streamJSON($data);
	}
	public function delete($id, $col="id"){
		$this->before_delete($id, '');
		$this->library->database->delete($this->table, array($col => $id));
	}
	/* HELPERS */
	public function where($where){
		(!isset($this->params['where'])) ? $this->params['where']=array() : false;
		$this->params['where'] = array_merge($this->params['where'], $where);
		return $this;
	}
	public function limit($num){
		$this->params['limit'] = $num;
		return $this;
	}

	public function cols($cols, $or = false){
		$this->_Cols(); // set up for using columns
		$cols = (is_array($cols)) ? $cols : array($cols);
		if($or){
			$this->params['cols'] = $cols;
			return $this;
		}
		$this->params['cols'] = array_merge($this->params['cols'], $cols);
		return $this;
	}

	protected function dot($array){
		$return = array();
		foreach($array as $key => $value){
			foreach($value as $t){
				$return[] = $key . "." . $t;
			}
		}
		return $return;
	}

	/* Empty Return Defaults */
	public function parse_collection($return){
		return $return;
	}
	public function before_get(){

	}
	public function before_get_model($id){

	}
	public function before_get_collection(){

	}
	public function before_delete($id, $data){

	}
	public function before_put($id, $data){
		return $data;
	}
	public function before_post($data){
		return $data;
	}
	public function after_post($id, $data){
		return $data;
	}
	public function before_patch($id, $data){
		return $this->before_put($id, $data);
	}

}

?>