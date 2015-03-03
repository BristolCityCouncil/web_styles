<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");
/* ---------------------------------------------------------------------
 * Databae Class
 * ---------------------------------------------------------------------
 * This is a helper class to make connections and queries to the
 * database safer and quicker. It includes caching for speeding your
 * application up, including customisable expiry. Includes return
 * methods.
 *
 * ---------------------------------------------------------------------
 * The Methods
 * ---------------------------------------------------------------------
 *
 * 1. db_connect     - makes connection to database
 * 2. load_db        - selects database
 * 3. setReturn      - sets the return type for select
 * 4. sql_return     - generates the return
 * 5. select         - simple 'select' sql function
 * 6. update         - simple 'update' sql function
 * 7. delete         - simple 'delete' sql function
 * 8. add            - adds X amount onto table record
 * 9. db_close       - closes connection to database
 *
 * ---------------------------------------------------------------------
 */

    class Library_database extends Blackgrid {
        public $db, $connected, $mysql, $return, $cache, $expire, $folder,$current_db, $keys,$lastQ;
        public function __construct(){
            // parent::__construct(get_class($this));
            // Get database config file
            global $_database;
            $this->db = $_database;
            // Start MySQL Connection
            $this->mysql = $this->db_connect();
            $this->cache = 0;
            $this->folder = "md5";
            $this->lastQ = '';
            defined("DEFAULT_DATABASE") ? $this->load_db(DEFAULT_DATABASE) : TRUE;
            $this->keys = array(
				"select" 				=> "SELECT ",
				"from"					=> "FROM ",
				"where" 				=> "WHERE ",
				"order_by"				=> "ORDER BY ",
				"limit"					=> "LIMIT ",
				"like"					=> "LIKE ",
				"and"					=> " AND ",
				"or"					=> " OR ",
				"leftjoin"				=> "LEFT OUTER JOIN ",
				"on"					=> " ON ",
				"group_by"				=> "GROUP BY "
			);
        }

        public function __required(){
			return array(
				"library" => array("code"),
			);
        }


        public function db_connect(){
            // Set DB variables from config
            $db_username = $this->db['username'];
            $db_password = $this->db['password'];
            $db_host     = $this->db['host'];

            // Start Connection
            $mysql = mysqli_connect($db_host,$db_username,$db_password);
            (!$mysql ? die("ERROR: " . mysqli_error($this->mysql)) : TRUE);
            // Return MySQL Resource
            return $mysql;
        }

        public function load_db($database){
            //switch loaded database
            $dbc = mysqli_select_db($this->mysql, $database);
            (!$dbc ? die("ERROR: " . mysqli_error($this->mysql)) : TRUE);
            $this->current_db = $database;
            return false;
        }

        public function setReturn($return){
        	if($this->cache){
        		$this->return = "array";
        		return false;
        	}
            switch($return){
                case 'array':
                    $this->return = "array";
                    break;
                case 'raw':
                default :
                    $this->return = "raw";
                    break;
            }
            return false;
        }

        public function startCache($expire=600,$folder=""){
        	$this->cache = 1;
        	$this->expire = $expire;
        	$folder!="" ? $this->folder = $folder : TRUE;
        }

        public function endCache(){
        	$this->cache = 0;
        }


		public function mysqli_cached_query($query){
			$folder = $this->folder;
			$file = md5($query);
			if(!is_dir(hygrid('i/application/cache/' . $folder, true))){
				mkdir(hygrid('i/application/cache/' . $folder, true), 0777, true);
			}
			$file = hygrid('i/application/cache/' . $folder . "/" . $file, true);
			$expire = $this->expire;
			if (file_exists($file) &&
			    filemtime($file) > (time() - $expire)) {
				    $records = unserialize(implode('',file($file)));
			    }else{
					$result = mysqli_query($this->mysql, $query);
					$records = array();
					while ($record = mysqli_fetch_array($result) ) {
		            	foreach($record as $k=>$a){
		                	if(is_int($k)){
			                	unset($record[$k]);
		                	}
		            	}
					    $records[] = $record;
					}
					$OUTPUT = serialize($records);
					$fp = fopen($file,"w"); // open file with Write permission
					fputs($fp, $OUTPUT);
					fclose($fp);
				}
			return $records;
		}


        private function sqlReturn($sql){
            if($this->return=="array"){
                $returnArray = array();
                if(!$sql){ return $returnArray; }
                while($row = mysqli_fetch_array($sql)){
                	foreach($row as $k=>$a){
	                	if(is_int($k)){
		                	unset($row[$k]);
	                	}
                	}
                    $returnArray[] = $row;
                }
                return $returnArray;
            }else{
                return $sql;
            }
        }
		/*
		public function select($table, array(
			"table" => "string",
			"cols" => array(col),
			"where" => array(col => value),
			"orderby" => "string or arrary()",
			"limit" => "string",
			"offset" => "string"

		));
		*/

        public function select($table, $cols="*", $where="", $orderby="", $limit=-1, $offset=-1){
            $query = "";
            $query .= "SELECT ";
            if($cols != "*"){
                if(is_array($cols)){
                    $query .= implode(",", $cols);
                }else{
                    $query .= $cols;
                }
            }else{
                $query .= "*";
            }
            $query .= " FROM ";
            $query .= "" . $table . "";

            if($where != ""){
                $query .= " WHERE ";
                if(is_array($where)){
	                $count = count($where);
	                foreach($where as $key => $value){
	                    $count--;
	                    $query .= $key . "='" . $value . "'";
	                    if($count > 0){
	                        $query .= " AND ";
	                    }
	                }
                }else{
	                $query .= $where;
                }
            }
            if($orderby!=""){
            	$query .= " ORDER BY " . $orderby;
            }
            if($limit > 0 AND $offset < 1){
                $query .= " LIMIT " . $limit;
            }
            if($limit > 0 AND $offset > 0){
	            $query .= " LIMIT " . $offset . "," . $limit;
            }
            if($this->cache){
	            $data = $this->mysqli_cached_query($query);
	            return $data;
	        }else{
            	$data = mysqli_query($this->mysql, $query);
	            if(!$data) die("ERROR: " . mysqli_error($this->mysql));
    	        return $this->sqlReturn($data);
    	    }
        }

        public function update($table, $setVars, $whereVars="",$limit=""){
            $query  = "";
            $query .= "UPDATE ";
            $query .= $table;
            $query .= " SET ";
            $countSet = count($setVars);
            foreach($setVars as $key => $value){
                $query .= $key;
                $query .= " = '";
                $query .= $value;
                $query .= "'";
                $countSet--;
                if($countSet > 0){
                    $query .= ",";
                }
                $query .= " ";
            }
            if($whereVars != ""){
                $query .= " WHERE ";
                if(is_array($whereVars)){
	                $count = count($whereVars);
	                foreach($whereVars as $key => $value){
	                    $count--;
	                    $query .= $key . "='" . $value . "'";
	                    if($count > 0){
	                        $query .= " AND ";
	                    }
	                }
                }else{
	                $query .= $whereVars;
                }
            }
            if($limit != ""){
	           $query .= "LIMIT ";
	           $query .= $limit;
            }
            mysqli_query($this->mysql, $query);
            return false;
        }

        public function insert($table, $setVars){
	        $query  = '';
	        $query .= 'INSERT INTO ';
	        $query .= $table;
	        $cols   = ' (';
	        $values = ' VALUES (';
	        $countSet = count($setVars);
	        foreach($setVars as $key => $value){
		        $cols .= "$key";
		        $values .= "'$value'";
                    $countSet--;
				if($countSet > 0){
				    $cols .= ",";
				    $values .= ",";
				}
				$cols .= " ";
			    $values .= " ";

	        }
	        $query .= $cols . ')' . $values . ')';
	        mysqli_query($this->mysql, $query);
	        return true;
        }

        public function delete($table, $whereVars){
            if($whereVars == "") die("ERROR: No record selected.");
            $query = "";
            $query .= "DELETE FROM ";
            $query .= $table;
            $query .= " WHERE ";
            $countWhere = count($whereVars);
            foreach($whereVars as $key => $value){
                $query .= $key;
                $query .= " = '";
                $query .= $value;
                $query .= "'";
                $countWhere--;
                if($countWhere > 0){
                    $query .= " AND ";
                }
                $query .= " ";
            }
            mysqli_query($this->mysql, $query);
            return false;
        }

        public function add($table,$whereVars,$col,$number=1){
            if($whereVars == "") die("ERROR: No record selected.");
            $query = "";
            $query .= "UPDATE ";
            $query .= $table;
            $query .= "SET " . $col . "= " . $col ." + " . $number;
            $query .= " WHERE ";
            $countWhere = count($whereVars);
            foreach($whereVars as $key => $value){
                $query .= $key;
                $query .= " = '";
                $query .= $value;
                $query .= "'";
                $countWhere--;
                if($countWhere > 0){
                    $query .= ",";
                }
                $query .= " ";
            }
            mysqli_query($this->mysql, $query);
            return false;
        }

        /* Blackgrid SQL Admin */

        public function create_db($db_name,$auto_select=true)
        {
        	if($db_name == "") die("ERROR: New table name not defined");
        	if(mysqli_select_db($table_name) && DEVELOPMENT == true) echo "WARNING: Database '" . $db_name . "' already exists";
	        $query = "CREATE DATABASE IF NOT EXISTS $db_name;";
			$data = mysqli_query($this->mysql, $query);
            if(!$data) die("ERROR: " . mysqli_error($this->mysql));
            if($auto_select) mysqli_select_db($db_name);
            return true;
        }


		public function table_exists($table_name)
		{
			$tables = array();
			$tablesResult = mysqli_query($this->mysql, "SHOW TABLES FROM " . $this->current_db . ";");
			while ($row = mysqli_fetch_row($tablesResult)) $tables[] = $row[0];
			return(in_array($tableName, $tables));
		}

        public function create_table($table_name)
        {
        	/*** WILL NEED NEW CLASS FOR CREATE TABLE ***/
        	/*
	        * if($this->table_exists($table_name)) return false;
	        * if (mysqli_query($this->mysql, "CREATE DATABASE $table_name;"));
	        */
	        return true;
        }

        public function get_tables()
        {
	        $query = "SHOW TABLES FROM " . $this->current_db . ";";
			$result = mysqli_query($this->mysql, $query);
			if (!$result) die('MySQL Error: ' . mysqli_error($this->mysql));
			$tables = array();
			while ($row = mysqli_fetch_row($result)) $tables[] = $row[0];
			return $tables;
        }

        public function get_rows($table){
        	$query = "SHOW COLUMNS FROM " . $table;
			$result = mysqli_query($this->mysql, $query);
			if (!$result) die('MySQL Error: ' . mysqli_error($this->mysql));
			$tables = array();
			while ($row = mysqli_fetch_row($result)) $tables[] = $row[0];
			return $tables;
        }

        public function table_dump($table,$limit=30,$offset=0)
        {
        	$this->setReturn("array");
	        return $this->select($table, $cols="*", $where="", $orderby="", $limit, $offset);

        }
        public function table_info($table_name){
        	if($table_name=="") die("ERROR: Table Undefined.");
	        $query = "describe " . $table_name . ";";
	        $result = mysqli_query($this->mysql, $query);
			if (!$result) die('MySQL Error: ' . mysqli_error($this->mysql));
			$table_info = array();
			while ($row = mysqli_fetch_row($result)) $table_info[] = $row;
			return $table_info;
        }


        /* BgSQL End */


        public function slugengine($table, $salt, $client_id=false, $options=[]){
        	$vars = [
        		'cols' => 'id',
        		'identifier' => 'id',
        	];
        	if(isset($options['vars'])){
        		$vars = $options['vars'];
        	}
        	if($client_id){
        		$vars['where'] = ['client_id' => $client_id];
        	}else{
        	}
        	$blacklist = $this->get($table, $vars);
        	$blacklist = array_column($blacklist, $vars['identifier']);
        	$slug = $this->make_slug($salt, $options);

			if(in_array($slug, $blacklist)){
				$count = 1;
				$orig_slug = $slug;
				while(in_array($slug, $blacklist)){
					$slug = $orig_slug .'-'. $count;
					$count++;
				}
			}
			return $slug;
        }

        /**
		 * Create a web friendly URL slug from a string.
		 *
		 * Although supported, transliteration is discouraged because
		 *     1) most web browsers support UTF-8 characters in URLs
		 *     2) transliteration causes a loss of information
		 *
		 * @author Sean Murphy <sean@iamseanmurphy.com>
		 * @copyright Copyright 2012 Sean Murphy. All rights reserved.
		 * @license http://creativecommons.org/publicdomain/zero/1.0/
		 *
		 * @param string $str
		 * @param array $options
		 * @return string
		 */
		public function make_slug($str, $options = array()) {
			// Make sure string is in UTF-8 and strip invalid UTF-8 characters
			$str = mb_convert_encoding((string)$str, 'UTF-8', mb_list_encodings());

			$defaults = array(
				'delimiter' => '-',
				'limit' => 25,
				'lowercase' => true,
				'replacements' => array(),
				'transliterate' => false,
				'blacklist' => ['new'],
			);

			// Merge options
			$options = array_merge($defaults, $options);

			$char_map = array(
				// Latin
				'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C',
				'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
				'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O',
				'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH',
				'ß' => 'ss',
				'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c',
				'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
				'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o',
				'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th',
				'ÿ' => 'y',

				// Latin symbols
				'©' => '(c)',

				// Greek
				'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
				'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
				'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
				'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
				'Ϋ' => 'Y',
				'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
				'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
				'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
				'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
				'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',

				// Turkish
				'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
				'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g',

				// Russian
				'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
				'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
				'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
				'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
				'Я' => 'Ya',
				'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
				'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
				'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
				'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
				'я' => 'ya',

				// Ukrainian
				'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
				'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',

				// Czech
				'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U',
				'Ž' => 'Z',
				'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
				'ž' => 'z',

				// Polish
				'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z',
				'Ż' => 'Z',
				'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
				'ż' => 'z',

				// Latvian
				'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N',
				'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
				'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
				'š' => 's', 'ū' => 'u', 'ž' => 'z'
			);

			// Make custom replacements
			$str = preg_replace(array_keys($options['replacements']), $options['replacements'], $str);

			// Transliterate characters to ASCII
			if ($options['transliterate']) {
				$str = str_replace(array_keys($char_map), $char_map, $str);
			}

			// Replace non-alphanumeric characters with our delimiter
			$str = preg_replace('/[^\p{L}\p{Nd}]+/u', $options['delimiter'], $str);

			// Remove duplicate delimiters
			$str = preg_replace('/(' . preg_quote($options['delimiter'], '/') . '){2,}/', '$1', $str);

			// Truncate slug to max. characters
			$str = mb_substr($str, 0, ($options['limit'] ? $options['limit'] : mb_strlen($str, 'UTF-8')), 'UTF-8');

			// Remove delimiter from ends
			$str = trim($str, $options['delimiter']);

			$ret = $options['lowercase'] ? mb_strtolower($str, 'UTF-8') : $str;

			if(in_array($ret, $options['blacklist'])){
				$ret = $ret . '-0';
			}

			return $ret;
		}


        /* HyGrid Database Advance Select */

        public function get($table, $vars=array())
        {
        	//        public function select($table, $cols="*", $where="", $orderby="", $limit=-1, $offset=-1){
        	$keys = $this->keys;
	       	extract( array_merge( array(
	       		/* Defaults */
		    	'cols' 					=> '* ',
		    		'make_array'		=> false, // not yet
		    		'cols_adv'			=> false,
		    	'where' 				=> false,
			    	'where_adv' 		=> false,
			    'orderby'				=> false,
			    'limit'					=> false,
			    'offset'				=> false,
			    'leftjoin'				=> false,
			    	'leftjoinor'		=> false,
			    'groupby'				=> false,
			    'limit'					=> false,
                'count_rows'			=> false,
                    'row_number'        => false,
			), $vars ) );

            if($row_number){
                $limit = array(1, $row_number-1);
                // $offset = $row_number-1;
            }

            if($count_rows){
                if($offset){
                    $count_rows_q = ", (SELECT @rownum:=" . $offset . ") r ";
                }else{
                    $count_rows_q = ", (SELECT @rownum:=0) r ";
                }
                $table .= $count_rows_q;
                if(trim($cols) == "*"){
                    $cols .= ', @rownum:=@rownum+1 AS no';
                }else if($cols && is_array($cols)){
                    $cols[] = ', @rownum:=@rownum+1 AS no';
                }
            }


							$query   = array();
							$query[] = $keys['select'];
							$query[] = $this->makeCols($cols);
			($cols_adv) ?	$query[] = $this->makeColsAdv($cols_adv) : false;
/* 							$query[] = $this->makeArrayCols($cols); // not yet  */
							$query[] = $this->makeTable($table);
			($leftjoin) ?	$query[] = $this->makeLeftJoin($leftjoin) : false;
			($leftjoinor) ?	$query[] = $this->makeLeftJoinOr($leftjoinor) : false;
			($where) ? 		$query[] = $this->makeWhere($where) : false;
			($groupby) ? 	$query[] = $this->makeGroupby($groupby) : false;
			($orderby) ? 	$query[] = $this->makeOrderby($orderby) : false;
			($limit) ? 		$query[] = $this->makeLimit($limit) : false;

			$query = implode($query);
			$this->lastQ = $query;
			if($this->cache){
	            $data = $this->mysqli_cached_query($query);
	        }else{
            	$data = mysqli_query($this->mysql, $query);
	            if(!$data){ echo "ERROR: " . mysqli_error($this->mysql); }
	            $this->setReturn('array');
    	        $data = $this->sqlReturn($data);
    	    }
    	    ($cols_adv) ?	$array_columns = $this->parseColsAdv($cols_adv) : $array_columns = array();
    	    foreach($data as  $row_k => $row){
    	    	foreach($array_columns as $key => $ac){
    	    		if(!array_key_exists($key, $data[$row_k])){
    	    			if(isset($data[$row_k][$ac])){
	    	    			$data[$row_k][$key] = explode(":-:",$data[$row_k][$ac]);
	    	    		}else{
		    	    		$data[$row_k][$key] = array();
	    	    		}
	    	    		$data[$row_k][$key] = array_unique($data[$row_k][$key]);
	    	    		unset($data[$row_k][$ac]);
    	    		}else{
	    	    		$data[$row_k][$ac] = explode(":-:",$data[$row_k][$ac]);
	    	    		$data[$row_k][$ac] = array_unique($data[$row_k][$ac]);
    	    		}
    	    	}
    	    }
    	    return $data;


        }
        public function makeLimit($limit)
        {
	        $keys = $this->keys;
	        $query = $this->keys['limit'];
	        if(is_array($limit))
	        {
		        $query .= $limit[0];
	        	if(isset($limit[1]))
	        	{
	        		$query .= "," . $limit[1];
	        	}
	        }else{
		        $query .= $limit . " ";
	        }
	        return $query;
        }
        public function showLastQuery(){
	        echo $this->lastQ;
        }

        public function makeGroupby($groupby){
	        $keys = $this->keys;
	        $query = $this->keys['group_by'];
	        if(is_array($groupby))
	        {
	            $grouping = array();
	            foreach($groupby as $value)
	            {
					$grouping[] = $value;
					unset($o);
	            }
	            $query .= implode(",", $grouping);
	        }else{
	            $query .= $groupby;
	        }
	        $query .= " ";
	        return $query;
        }

        public function parseColsAdv($cols_adv){
        	$o = array();
        	$al = array();
        	$allowed_cols = array('array' => 'GROUP_CONCAT','count' => 'COUNT');
	        foreach($cols_adv as $table => $cols)
	        {
		        if(is_array($cols)){
		        	foreach($cols as $col => $type)
		        	{
		        		if(is_array($type))
		        		{
		        			foreach($type as $t)
		        			{
		        				if(array_key_exists($t, $allowed_cols)){
		        					if($t!="count"){
				        				$o[$table . '__' . $col . '_' . $t] = "HyGR__" .$t . "__" . $t . "_" . $col;
				        			}
		        				}
		        			}
		        		}else{
			        		if(array_key_exists($type, $allowed_cols)){
	        					if($type!="count"){
			        				$o[$table . '__' . $col . '_' . $type] = "HyGR__" .$table . "__" . $type . "_" . $col;
			        			}
	        				}
		        		}
		        	}
		        }
	        }
	        return $o;
        }

        public function makeLeftJoinOr($leftjoin_or){
	        $keys = $this->keys;
	        $query = "";
	        $o = array();
	        foreach($leftjoin_or as $ljo){
		        $o[] = $keys['leftjoin'] . $ljo;
	        }
	        $query = implode(" ", $o);
	        return $query . " ";
        }

        public function makeLeftJoin($leftjoin){
	        $keys = $this->keys;
	        $query = "";
	        $o = array();
	        if(is_array($leftjoin))
	        {
		        foreach($leftjoin as $lj)
		        {
		        	// LEFT JOIN staff_group ON staff_group.group_id = groups.id
		        	$tb = explode(".", $lj[1]);
			        $t  = $keys['leftjoin'];
			        $t .= $tb[0];
			        $t .= $keys['on'];
			        $t .= $lj[1];
			        $t .= " = ";
			        $t .= $lj[0];
			        $query .= $t . " ";
			        unset($t);
		        }

	        }else{
		        $query .= $leftjoin;
	        }
	        $query .= " ";
	        return $query;
        }

        public function makeColsAdv($cols_adv)
        {
	        $query = ",";
	        $keys = $this->keys;
        	$o = array();
        	$allowed_cols = array('array' => 'GROUP_CONCAT','count' => 'COUNT');
        	$in = 0;
	        foreach($cols_adv as $table => $cols)
	        {
        		$in++;
	        	$px = $table . ".";
	        	if(is_array($cols)){
		        	foreach($cols as $col => $type)
		        	{
	        			if(is_int($col)){
	        				if($in==1){
		        				$o[] = $px . $type;
	        				}else{
			        			$o[] = $px . $type . " AS " . $table . "__" . $type;
			        		}
	        			}else{
			        		if(is_array($type))
			        		{
			        			foreach($type as $t)
			        			{
			        				if(array_key_exists($t, $allowed_cols)){
			        					if($t=="count"){
				        					$o[] = $allowed_cols[$t] . "( DISTINCT " . $px . $col . ") AS " . $table . "__" . $col . "_" . $t;
			        					}else{
					        				$o[] = $allowed_cols[$t] . "( DISTINCT " . $px . $col . " SEPARATOR ':-:') AS HyGR__" .$table . "__" . $t . "_" . $col;
					        			}
			        				}
			        			}
			        		}else{
				        		if(array_key_exists($type, $allowed_cols)){
		        					if($type=="count"){
			        					$o[] = $allowed_cols[$type] . "( DISTINCT " . $px . $col . ") AS " . $table . "__" . $col . "_" . $type;
		        					}else{
				        				$o[] = $allowed_cols[$type] . "( DISTINCT " . $px . $col . " SEPARATOR ':-:') AS HyGR__" .$table . "__" . $type . "_" . $col;
				        			}
		        				}
			        		}
			        	}
		        	}
		        }else{
			       $o[] = $px . $cols;
		        }
	        	unset($px);
	        }
	        $query .= implode(",", $o);
	        $query .= " ";
	        return $query;

        }

        public function makeOrderby($orderby)
        {
	        $keys = $this->keys;
	        $query = $this->keys['order_by'];
	        if(is_array($orderby))
	        {
	            $orders = array();
	            $allowed_orders = array("ASC","DESC");
	            foreach($orderby as $key => $value)
	            {
	            	if(in_array($value, $allowed_orders)){
		            	$o = $key . " " . $value;
	            	}else{
		            	$o = $value;
	            	}
					$orders[] = $o;
					unset($o);
	            }
	            $query .= implode(",", $orders);
	        }else{
	            $query .= $orderby;
	        }
	        $query .= " ";
	        return $query;
        }

        public function makeTable($table){
	        $keys = $this->keys;
	        $query = $keys['from'];
			(is_array($table)) ?
				$query .= implode(",", $table) :
				$query .= $table;
			$query .= " ";
			return $query;
        }

        public function makeCols($cols)
        {
        	$query = "";
	        ($cols != "*") ?
	        	(is_array($cols)) ?
	        		 $query .= implode(",", $cols) :
	        		 $query .= $cols
	        	: false;
	        $query .= " ";
	        return $query;
        }

        public function makeWhere ($whereVars)
        {
	        $keys = $this->keys;
	        $query = $this->keys['where'];

	        if(is_array($whereVars))
	        {
	            $count = count($whereVars);
	            foreach($whereVars as $key => $value)
	            {
	            	if(is_int($key))
	            	{
	            		$query .= $value;
	            	}else{
		                $query .= $key . "='" . $value . "'";
	            	}
	                $count--;
	                if($count > 0)
	                {
	                    $query .= " AND ";
	                }
	            }
	        }else{
	            $query .= $whereVars;
	        }
	        $query .= " ";
	        return $query;
        }

        /* HyGrid DAS END */


        public function db_close(){
            mysqli_close($this->mysql);
        }
        public function __destruct(){
            $this->db_close();
        }
    }
/* ---------------------------------------------------------------------
 * End of file: /system/library/database.class.php
 */
?>