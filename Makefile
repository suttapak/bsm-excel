.PHONY: build dev

build:
	GOOS=windows GOARCH=amd64 CGO_ENABLED=1 \
	CC=x86_64-w64-mingw32-gcc \
	CXX=x86_64-w64-mingw32-g++ \
	CGO_CXXFLAGS="-I/mingw64/include" \
	WAILSPLATFORM=windows/amd64 \
	wails build --ldflags='-extldflags "-static"' -skipbindings -clean -nsis

dev:
	wails dev -loglevel Error
