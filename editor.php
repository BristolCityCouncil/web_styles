<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Editor</title>
  <style type="text/css" media="screen">
    body {
        overflow: hidden;
    }

    #editor {
        margin: 0;
        position: absolute;
        top: 0;
        bottom: 41px;
        left: 0;
        right: 0;
    }
    #saver {
      height: 40px;
      border-top: 1px solid #000;
      box-shadow: -3px 0 3px 0 rgba(0,0,0,.4);
      color: #FFF;
      background: #111122;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: right;
    }
    #saver button {
      height: 40px;
      border: none;
      background: #222233;
      color: #FFF;
      padding: 0 30px;
    }
    #saver button:hover {
      background: #333344;
      cursor: pointer;
      outline: none;
    }
    #saver button:active {
      box-shadow: inset 0 3px 10px 0 rgba(0,0,0,.3);
    }
    #saver button:focus {
      outline: none;
    }
  </style>
</head>
<body>

<pre id="editor"><?php 
$file = "templates" . $_GET['file'] . ".html";
$source = file_get_contents($file);
echo htmlentities($source); ?></pre>


<div id="saver">
  <button>Save</button>
</div>

<script src="ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_eighties");
    editor.getSession().setMode("ace/mode/handlebars");
</script>

</body>
</html>
