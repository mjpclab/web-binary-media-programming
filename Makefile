.PHONY: build dev clean init example

build: clean
	mdbook build
clean:
	rm -rf dist/
dev:
	mdbook serve -n [::]
init:
	cargo install mdbook
example:
	ghfs -l 8080 -r src/example --global-header 'cache-control: public, max-age=0' --header ':/shared-array-buffer:Cross-Origin-Opener-Policy:same-origin' --header ':/shared-array-buffer:Cross-Origin-Embedder-Policy:require-corp'
