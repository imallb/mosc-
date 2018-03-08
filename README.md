<h1 style="color:#0366d6;">mosc后台</h1>
<h3>window环境配置</h3>
<div>
  <ul>
    <li>node.js 后台程序运行语言</li>
    <li>mongodb 后台数据库</li>
  </ul>
</div>
<br>
<h3>node.js在window安装</h3>
<div>在浏览器打开node官网<a href="https://nodejs.org/en/download/">https://nodejs.org/en/download/</a>下载window二进制版本（.msi），下载完成后，双击点开按提示逐步完成。</div>
<br>
<h3>mongodb在window安装</h3>
<div>在浏览器打开node官网<a href="https://www.mongodb.com/download-center#community">https://www.mongodb.com/download-center#community</a>下载window二进制版本（.msi），下载完成后，双击点开按提示逐步完成。然后在数据库安装的盘的跟目录下创建存储数据的文件夹：data；然后打开data文件夹，再创建db文件夹。</div>
<br>
<h3>window下使用mosc后台</h3>
<div>下载全部文件，打开cmd，找到项目根目录，输入以下命令安装模块：</div>
<pre>mpn install</pre>
<div>模块安装完成后，先打开mongodb数据库，点开mongodb数据库文件根目录，打开bin文件夹，启动mongod.exe；然后，启动后台程序，在cmd中输入以下命令：</div>
<pre>node index.js</pre>
