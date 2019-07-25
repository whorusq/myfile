# myfile

The NodeJS static web server.

## Install

```
npm i -g myfile
```

## Usage

```bash
# start server with default options.
# - server port: 3333
# - file directory: .
myfile

# custmize the port
myfile -p 6666

# custmize the directory
myfile -d /home/user1

# custmize the root path and server port,
# and open the url after start the server.
myfile -d /usr -p 6666 --auto

# show version
myfile -v

# show help
myfile -h
```
