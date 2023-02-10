
install:
	npm install
	cd client && npm install

dev:
	cd client && npm run start

build:
	cd client && npm run build

prod:
	cd client && npx http-server ./build