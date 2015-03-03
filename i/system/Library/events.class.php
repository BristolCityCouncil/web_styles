<?php if( ! defined("CALLED_FROM_FILE")) die("Access Forbidden");
class Events {

	public static $events = array();
	public static $once_events = array();

	public static function subscribe($name, $fn, $self = null){
		self::$events[$name][] = array(
			'fn' => $fn,
			'scope' => $self,
			'class' => get_class($self)
		);
	}
	public static function publish($name){
		if(isset(self::$events[$name])){
			foreach(self::$events[$name] as $event){
				Closure::bind($event['fn'], $event['scope'], $event['class']);
				$event['fn']();
			}
		}
		if(isset(self::$once_events[$name])){
			$_ev = self::$once_events[$name];
			unset(self::$once_events[$name]);
			foreach($_ev as $once_event){
				Closure::bind($once_event['fn'], $once_event['scope'], $once_event['class']);
				$once_event['fn']();	
			}
		}
	}
	public static function pub($name){
		return self::publish($name);
	}
	public static function sub($name, $fn, $self = null){
		return self::subscribe($name, $fn, $self);
	}
	public static function sub_once($name, $fn, $self = null){
		return self::subscribe_once($name, $fn, $self);
	}
	public static function subscribe_once($name, $fn, $self = null){
		self::$once_events[$name][] = array(
			'fn' => $fn,
			'scope' => $self,
			'class' => get_class($self)
		);
	}

}
?>