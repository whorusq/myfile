<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{{title}}</title>
  <style>
    #wrap {
      width: 45%;
      margin: 0 auto;
      margin-top: 100px;
      padding: 0;
    }
    #wrap table {
      border-collapse: collapse;
    }
    #wrap table tr.title,
    #wrap table tr.title:hover {
      background-color: #555555;
      color: #fff;
    }
    #wrap table tr:hover {
      background-color: #eee;
    }
    #wrap table tr .a-center {
      text-align: center;
    }
    #wrap table tr td {
      border-bottom: 1px solid #eee;
      height: 30px;
      line-height: 30px;
    }
    #wrap table tr td a {
      display: inline-block;
      height: 18px;
      line-height: 18px;
      text-decoration: none;
    }
    #wrap table tr td a:hover {
      /* border-bottom: 1px solid red; */
      color: red;
      font-weight: bold;
    }
    #wrap ul li a {
      font-size: 18px;
      text-decoration: none;
    }
    #wrap ul li a:hover {
      color: orangered;
    }
  </style>
</head>
<body>
  <div id="wrap">
    <table width="100%" >
      <tr class="title">
        <th width="50%">文件名</th>
        <th width="25%">大小</th>
        <th width="25%">修改时间</th>
      </tr>
      {{#each files}}
      <tr>
        <td><a href="{{this.path}}/{{this.fileName}}">{{this.fileName}}</a></td>
        <td class="a-center">{{this.size}}</td>
        <td class="a-center">{{this.mtime}}</td>
      </tr>
      {{/each}}
    </table>
  </div>
</body>
</html>
