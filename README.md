# tcp-proxy
A Simple non-terminating tcp proxy server

## How to Use

#### To start the tcp proxy server at `8080` listen on `all interfaces` and log  `client 192.168.43.12` related issues 
```sh
node index.js -p 8080 -h 0.0.0.0 -f 192.168.43.12
```

## Verbosity

#### To fix verbosity of logs `--verbose` or `-v` can be set from `0` alias `silent` to `3` meaning `all logs`
```sh
node index.js -p 8080 -h 0.0.0.0 -v 3
```
each of the verbosity level corresponds to following `DEBUG=*` values
```javascript
['','proxy:status', 'proxy:status:*', 'proxy:log:*,proxy:log', 'error,error:*']
```
## Debug
Following DEBUG scopes are possible:

- error
- error:<client address>
- proxy:log
- proxy:log:<client address>
- proxy:status
- proxy:status:<client address>

## :warning: Don't use in production
- This is not a complete proxy server , many rings and bells are not there
- Use for testing and learning pupose only

