.PHONY: build dev clean init

build: clean
	mdbook build
clean:
	rm -rf dist/
dev:
	mdbook serve -n [::]
init:
	cargo install mdbook mdbook-chapter-zero
example:
	ghfs -l 8080 -r src/example --global-header 'cache-control: public, max-age=0'
