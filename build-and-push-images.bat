@echo off

pushd backend
build-and-push-image.bat

popd
pushd frontend
build-and-push-image.bat

popd

PAUSE