#Krupskaya

This is a simple single page music player written mostly in javascript and hosted at [krupskaya.machinemen.fr](http://krupskaya.machinemen.fr).

Nginx configuration would look something like this:
```Nginx
server {
        listen 80;
        server_name krupskaya.machinemen.fr;
        return 301 https://$server_name$request_uri;  # enforce https
}

server {
        listen 443 ssl;
        server_name krupskaya.machinemen.fr;

        ssl_certificate /etc/ssl/nginx/common.crt;
        ssl_certificate_key /etc/ssl/nginx/common.key;

        root /var/www/krupskaya;

        #client_max_body_size 10G; # set max upload size
        #       fastcgi_buffers 64 4K;

        index index.php;

        #deny direct lookup of json files
        location ~* \.(?:json)$
        {
                access_log off;
                log_not_found off;
                deny all;
        }

        #deny hidden files (starting with .)
        location ~ /\.
        {
                access_log off;
                log_not_found off;
                deny all;
        }


        location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
                # Some basic cache-control for static files to be sent to the browser
                expires max;
                add_header Pragma public;
                add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        }

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        location ~ \.php$
        {
                fastcgi_split_path_info ^(.+\.php)(/.+)$;
                ## NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
                #
                ## With php5-cgi alone:
                #fastcgi_pass 127.0.0.1:9000;
                ## With php5-fpm:
                fastcgi_pass unix:/var/run/php5-fpm.sock;
                fastcgi_index index.php;
                include fastcgi_params;
        }

}
```

