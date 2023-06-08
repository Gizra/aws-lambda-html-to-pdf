FROM public.ecr.aws/lambda/nodejs:16

RUN yum update -y
RUN yum install nss


WORKDIR /var/task

COPY handler.js ./
COPY package.json ./
RUN npm install

ENTRYPOINT ["/lambda-entrypoint.sh", "handler.handler"]
