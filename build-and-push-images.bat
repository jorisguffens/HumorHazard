
pushd backend
@echo | call build-and-push-image.bat

popd
pushd frontend
@echo | call build-and-push-image.bat

popd

PAUSE