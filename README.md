# BestCMS
Create configuration file bestcms.conf with this format:
```
{
	"port": 1702,
	"db":	{
		  "host"     : "127.0.0.1",
		  "user"     : "root",
		  "password" : "1234",
		  "database" : "bestcms",
		  "multipleStatements" : true
		}
}
```
## Start

```
node app.js
```


## Developing



### Tools

## Testing ideas
```
{
	[
		test: { name: "Insert"
				inorder:[
					{url: "/cms/add_project", body: {name: "Project 00"}, success : { id : $integer } },
					{url: "/cms/get_project", body: {id: $$prev_res.id} , success : { name : "Project 00"}}
				]
		}
	]
}
```
## Doc

```
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
```

# TODO

https://www.npmjs.com/package/pre-push