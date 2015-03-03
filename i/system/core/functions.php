<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");

function array_fusion($ArrayOne, $ArrayTwo)
{
    return array_unique(array_merge($ArrayOne, $ArrayTwo));
}


function array_template(&$array, $template=0)
{
	$return_array = array();
	$return = false;
	(is_array($template)) ? true : $return = true;
	(empty($template)) ? $return = true : true;
	if($return){ return; }
	foreach($template as $value)
	{
		if(array_key_exists($value, $array)){
			$return_array[$value] = $array[$value];
		}
	}
	unset($key, $value);
	$array = $return_array;
	return $array;
}

function both($one, $two){
	if($one && $two){
		return true;
	}
	return false;
}

function array_unify(&$array, $keys=array()){
	$final = array();
	$prev = '';
	foreach($keys as $key){
		$final = array_unique(array_merge($final, $array[$key]));
		unset($array[$key]);
	}
	return $final;
}

function rename_key(&$array, $old_key, $new_key){
	$array[$new_key] = $array[$old_key];
	unset($array[$old_key]);
}
function multi_rename_key(&$array, $old_keys, $new_keys)
{
    if(!is_array($array)){
        ($array=="") ? $array=array() : false;
        return $array;
    }
    foreach($array as &$arr){
        if (is_array($old_keys))
        {
            foreach($new_keys as $k => $new_key)
            {
                (isset($old_keys[$k])) ? true : $old_keys[$k]=NULL;
                $arr[$new_key] = (isset($arr[$old_keys[$k]]) ? $arr[$old_keys[$k]] : null);
                unset($arr[$old_keys[$k]]);
            }
        }else{
            $arr[$new_keys] = (isset($arr[$old_keys]) ? $arr[$old_keys] : null);
            unset($arr[$old_keys]);
        }
    }
    return $array;
}

if (!function_exists('array_column')) {

    /**
     * Returns the values from a single column of the input array, identified by
     * the $columnKey.
     *
     * Optionally, you may provide an $indexKey to index the values in the returned
     * array by the values from the $indexKey column in the input array.
     *
     * @param array $input A multi-dimensional array (record set) from which to pull
     *                     a column of values.
     * @param mixed $columnKey The column of values to return. This value may be the
     *                         integer key of the column you wish to retrieve, or it
     *                         may be the string key name for an associative array.
     * @param mixed $indexKey (Optional.) The column to use as the index/keys for
     *                        the returned array. This value may be the integer key
     *                        of the column, or it may be the string key name.
     * @return array
     */
    function array_column($input = null, $columnKey = null, $indexKey = null)
    {
        // Using func_get_args() in order to check for proper number of
        // parameters and trigger errors exactly as the built-in array_column()
        // does in PHP 5.5.
        $argc = func_num_args();
        $params = func_get_args();

        if ($argc < 2) {
            trigger_error("array_column() expects at least 2 parameters, {$argc} given", E_USER_WARNING);
            return null;
        }

        if (!is_array($params[0])) {
            trigger_error('array_column() expects parameter 1 to be array, ' . gettype($params[0]) . ' given', E_USER_WARNING);
            return null;
        }

        if (!is_int($params[1])
            && !is_float($params[1])
            && !is_string($params[1])
            && $params[1] !== null
            && !(is_object($params[1]) && method_exists($params[1], '__toString'))
        ) {
            trigger_error('array_column(): The column key should be either a string or an integer', E_USER_WARNING);
            return false;
        }

        if (isset($params[2])
            && !is_int($params[2])
            && !is_float($params[2])
            && !is_string($params[2])
            && !(is_object($params[2]) && method_exists($params[2], '__toString'))
        ) {
            trigger_error('array_column(): The index key should be either a string or an integer', E_USER_WARNING);
            return false;
        }

        $paramsInput = $params[0];
        $paramsColumnKey = ($params[1] !== null) ? (string) $params[1] : null;

        $paramsIndexKey = null;
        if (isset($params[2])) {
            if (is_float($params[2]) || is_int($params[2])) {
                $paramsIndexKey = (int) $params[2];
            } else {
                $paramsIndexKey = (string) $params[2];
            }
        }

        $resultArray = array();

        foreach ($paramsInput as $row) {

            $key = $value = null;
            $keySet = $valueSet = false;

            if ($paramsIndexKey !== null && array_key_exists($paramsIndexKey, $row)) {
                $keySet = true;
                $key = (string) $row[$paramsIndexKey];
            }

            if ($paramsColumnKey === null) {
                $valueSet = true;
                $value = $row;
            } elseif (is_array($row) && array_key_exists($paramsColumnKey, $row)) {
                $valueSet = true;
                $value = $row[$paramsColumnKey];
            }

            if ($valueSet) {
                if ($keySet) {
                    $resultArray[$key] = $value;
                } else {
                    $resultArray[] = $value;
                }
            }

        }

        return $resultArray;
    }

}


function print_fr($array,$re=false){
	if($re){
		return print_r($array,true);
	}else{
		echo "<pre>";
		print_r($array);
		echo "</pre>";
	}
}

function protect($string){
    $string = urldecode($string); // url decode to make things like %20 into whitespace
    $string = trim(strip_tags($string)); //remove whitespaces
    $string = preg_replace("/'/", "", $string); //remove single quotes
    return $string;
}

function protect_2Darray($array){
	foreach($array as $key => $arr){
		$ok=$key;
		$key = protect($key);
		if(!is_array($arr)){
			$arr = protect($arr);
		}
		unset($array[$ok]);
		$array[$key] = $arr;
	}
	return $array;
}

function inIE()
{
    if (isset($_SERVER['HTTP_USER_AGENT']) && 
    (strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== false))
        return true;
    else
        return false;
}

function array_to_http($array){
      $retvar = '';
      while ( list ( $field, $data ) = @each ( $array ) )
      {
         $retvar .= ( empty($retvar) ) ? '' : '&';
         $retvar .= urlencode($field) . '=' . urlencode($data); 
      }
      return $retvar;
}

function generateID($length="9",$strength="5") {
        $vowels = 'aeuy';
        $consonants = 'bdghjmnpqrstvz';
        if ($strength & 1) {
            $consonants .= 'BDGHJLMNPQRSTVWXZ';
        }
        if ($strength & 2) {
            $vowels .= "AEUY";
        }
        if ($strength & 4) {
            $consonants .= '23456789';
        }
        if ($strength & 8) {
            $consonants .= '@#$%';
        }
        if($strength=="8"){
            $consonants = 'BDGHJLMNPQRST';
            $vowels = '23456789VWXZ';
        }
    
        $password = '';
        $alt = time() % 2;
        for ($i = 0; $i < $length; $i++) {
            if ($alt == 1) {
                $password .= $consonants[(rand() % strlen($consonants))];
                $alt = 0;
            } else {
                $password .= $vowels[(rand() % strlen($vowels))];
                $alt = 1;
            }
        }
        return $password;
}

function simpleCurl($link, $fields='', $refer='google.com'){
        $curl = curl_init();
    
        $post_fields = array_to_http($fields);
    
        // Set options
        curl_setopt ($curl, CURLOPT_URL, $link);
        curl_setopt ($curl, CURLOPT_POST, FALSE);
        curl_setopt ($curl, CURLOPT_POSTFIELDS, $post_fields );
        curl_setopt ($curl, CURLOPT_RETURNTRANSFER,1);
        curl_setopt ($curl, CURLOPT_HEADER, FALSE);
        curl_setopt ($curl, CURLOPT_REFERER, $refer);
        curl_setopt ($curl, CURLOPT_COOKIEJAR, '/tmp/cookieFileName' );
        curl_setopt ($curl, CURLOPT_COOKIEFILE, '/tmp/cookieFileName' );
//        curl_setopt ($curl, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt ($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT'] );
    
    	ob_start();      // prevent any output
    	$buf2 = curl_exec($curl);
        curl_exec($curl);
    	ob_end_clean();  // stop preventing output

        curl_close ($curl);
    
        return $buf2;
    
}

function parseURL($url,$subdomain=false) {
    if($url=="" OR !isset($url)){
	    return "INVALID LINK";
    }
	$raw_url= parse_url($url);
	
	if(!isset($raw_url['host'])){
	    return "INVALID LINK";
	}
	
	if ($raw_url['host'] == '') {
		$raw_url['host'] = $raw_url['path'];
	}
	if( preg_match("/^www\./i", $raw_url['host'])) {
		$www = true;
	} else { $www = false;  }
		if ($www==false) {
			$domain_only[1] = $raw_url['host'];
		} else {
			preg_match("/\.([^\/]+)/", $raw_url['host'] , $domain_only);
		}
	if ($subdomain == true) {
		preg_match("/\.([^\/]+)/", $domain_only[1] , $domain_only);
	}	
	return strtolower($domain_only[1]);
	// Credits: (C) 2004 by  Anand A. | www.ciantech.com | www.polurnet.com ~
}

function walk_protect(&$walk)
{
	if(!is_array($walk))
	{
		$walk = protect($walk);
	}else{
		array_walk($walk, 'walk_protect');
	}
}

function regexFilter($input){
    $order   = array('\\', '^', '.', '$', '|', '(', ')', '[', ']', '*', '+', '?', '{', '}', '\'', '-');
    $replace = array('\\\\', '\^', '\.', '\$', '\|', '\(', '\)', '\[', '\]', '\*', '\+', '\?', '\{', '\}', '\\\'' , '\-');
    return str_replace($order, $replace, $input);
}

function simpleRegex($query,$data){
    preg_match_all("|" . $query . "|U",
        $data,
        $out1, PREG_PATTERN_ORDER);
    	return $out1;
}

function isValidURL($url)
{
    return preg_match('|^http(s)?://[a-z0-9-]+(.[a-z0-9-]+)*(:[0-9]+)?(/.*)?$|i', $url);
}

function xml2array($contents, $get_attributes=1, $priority = 'tag') { 
    if(!$contents) return array(); 

    if(!function_exists('xml_parser_create')) { 
        //print "'xml_parser_create()' function not found!"; 
        return array(); 
    } 

    //Get the XML parser of PHP - PHP must have this module for the parser to work 
    $parser = xml_parser_create(''); 
    xml_parser_set_option($parser, XML_OPTION_TARGET_ENCODING, "UTF-8"); # http://minutillo.com/steve/weblog/2004/6/17/php-xml-and-character-encodings-a-tale-of-sadness-rage-and-data-loss 
    xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0); 
    xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 1); 
    xml_parse_into_struct($parser, trim($contents), $xml_values); 
    xml_parser_free($parser); 

    if(!$xml_values) return;//Hmm... 

    //Initializations 
    $xml_array = array(); 
    $parents = array(); 
    $opened_tags = array(); 
    $arr = array(); 

    $current = &$xml_array; //Refference 

    //Go through the tags. 
    $repeated_tag_index = array();//Multiple tags with same name will be turned into an array 
    foreach($xml_values as $data) { 
        unset($attributes,$value);//Remove existing values, or there will be trouble 

        //This command will extract these variables into the foreach scope 
        // tag(string), type(string), level(int), attributes(array). 
        extract($data);//We could use the array by itself, but this cooler. 

        $result = array(); 
        $attributes_data = array(); 
         
        if(isset($value)) { 
            if($priority == 'tag') $result = $value; 
            else $result['value'] = $value; //Put the value in a assoc array if we are in the 'Attribute' mode 
        } 

        //Set the attributes too. 
        if(isset($attributes) and $get_attributes) { 
            foreach($attributes as $attr => $val) { 
                if($priority == 'tag') $attributes_data[$attr] = $val; 
                else $result['attr'][$attr] = $val; //Set all the attributes in a array called 'attr' 
            } 
        } 

        //See tag status and do the needed. 
        if($type == "open") {//The starting of the tag '<tag>' 
            $parent[$level-1] = &$current; 
            if(!is_array($current) or (!in_array($tag, array_keys($current)))) { //Insert New tag 
                $current[$tag] = $result; 
                if($attributes_data) $current[$tag. '_attr'] = $attributes_data; 
                $repeated_tag_index[$tag.'_'.$level] = 1; 

                $current = &$current[$tag]; 

            } else { //There was another element with the same tag name 

                if(isset($current[$tag][0])) {//If there is a 0th element it is already an array 
                    $current[$tag][$repeated_tag_index[$tag.'_'.$level]] = $result; 
                    $repeated_tag_index[$tag.'_'.$level]++; 
                } else {//This section will make the value an array if multiple tags with the same name appear together 
                    $current[$tag] = array($current[$tag],$result);//This will combine the existing item and the new item together to make an array 
                    $repeated_tag_index[$tag.'_'.$level] = 2; 
                     
                    if(isset($current[$tag.'_attr'])) { //The attribute of the last(0th) tag must be moved as well 
                        $current[$tag]['0_attr'] = $current[$tag.'_attr']; 
                        unset($current[$tag.'_attr']); 
                    } 

                } 
                $last_item_index = $repeated_tag_index[$tag.'_'.$level]-1; 
                $current = &$current[$tag][$last_item_index]; 
            } 

        } elseif($type == "complete") { //Tags that ends in 1 line '<tag />' 
            //See if the key is already taken. 
            if(!isset($current[$tag])) { //New Key 
                $current[$tag] = $result; 
                $repeated_tag_index[$tag.'_'.$level] = 1; 
                if($priority == 'tag' and $attributes_data) $current[$tag. '_attr'] = $attributes_data; 

            } else { //If taken, put all things inside a list(array) 
                if(isset($current[$tag][0]) and is_array($current[$tag])) {//If it is already an array... 

                    // ...push the new element into that array. 
                    $current[$tag][$repeated_tag_index[$tag.'_'.$level]] = $result; 
                     
                    if($priority == 'tag' and $get_attributes and $attributes_data) { 
                        $current[$tag][$repeated_tag_index[$tag.'_'.$level] . '_attr'] = $attributes_data; 
                    } 
                    $repeated_tag_index[$tag.'_'.$level]++; 

                } else { //If it is not an array... 
                    $current[$tag] = array($current[$tag],$result); //...Make it an array using using the existing value and the new value 
                    $repeated_tag_index[$tag.'_'.$level] = 1; 
                    if($priority == 'tag' and $get_attributes) { 
                        if(isset($current[$tag.'_attr'])) { //The attribute of the last(0th) tag must be moved as well 
                             
                            $current[$tag]['0_attr'] = $current[$tag.'_attr']; 
                            unset($current[$tag.'_attr']); 
                        } 
                         
                        if($attributes_data) { 
                            $current[$tag][$repeated_tag_index[$tag.'_'.$level] . '_attr'] = $attributes_data; 
                        } 
                    } 
                    $repeated_tag_index[$tag.'_'.$level]++; //0 and 1 index is already taken 
                } 
            } 

        } elseif($type == 'close') { //End of tag '</tag>' 
            $current = &$parent[$level-1]; 
        } 
    } 
     
    return($xml_array); 
}

?>