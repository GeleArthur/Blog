# You forgot CMake again   
This is a list of handy cmake snippets. For me and YOU!!!


All `${PROJECT\_NAME}`  means your target.   
# Create project   
```
cmake_minimum_required(VERSION 3.29)
project(MyProject VERSION 1.0 LANGUAGES CXX)

add_executable(${PROJECT_NAME}
    main.cpp
)

```
   
# Cpp version   
```
# Global
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)

# Target
target_compile_features(${PROJECT_NAME} PRIVATE cxx_std_20)

```
   
# VCPKG   
```
include("$ENV{VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")

```
   
# Show resources in IDE   
```
file(GLOB_RECURSE RESOURCE_FILES "${CMAKE_CURRENT_SOURCE_DIR}/resources/*")
add_custom_target(Resources ALL SOURCES ${RESOURCE_FILES})

```
# MSVC default project. Only for .sln files   
```
set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${PROJECT_NAME})

```
   
# Create symlink   
```
add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E create_symlink
        "${CMAKE_CURRENT_SOURCE_DIR}/resources"
        "$<TARGET_FILE_DIR:${PROJECT_NAME}>/resources"
)
```
   
# Copy files   
```
file(GLOB_RECURSE RESOURCE_FILES "${CMAKE_CURRENT_SOURCE_DIR}/resources/*")

foreach(RESOURCE ${RESOURCE_FILES})
    add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy ${RESOURCE}
    "${CMAKE_CURRENT_BINARY_DIR}/resources/")
endforeach(RESOURCE)

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
  COMMAND "${CMAKE_COMMAND}" -E copy_directory "${CMAKE_CURRENT_SOURCE_DIR}/Data" "$<TARGET_FILE_DIR:${PROJECT_NAME}>/Data"
)


```
   
# Fetch Content   
When **configuring **the project download the required data.   
Warning in the docs look at external project for the commands as they are the same   
```
include(FetchContent)

FetchContent_Declare(
  SDL3
  GIT_REPOSITORY https://github.com/libsdl-org/SDL.git
  GIT_TAG release-3.2.4
  GIT_SHALLOW TRUE
  GIT_PROGRESS TRUE
)
FetchContent_MakeAvailable(SDL3)

```
# Link to library   
```
target_link_libraries(${PROJECT_NAME} PUBLIC 
    SDL3::SDL3            
)

```
   
# External Project   
When the project **builds **download the required data   
```
include(ExternalProject)
ExternalProject_Add(foobar
  GIT_REPOSITORY    git@github.com:FooCo/FooBar.git
  GIT_TAG           origin/release/1.2.3
)
```
   
# Auto gitignore build folder    
```
file(WRITE ${CMAKE_CURRENT_BINARY_DIR}/.gitignore *)
```
# Turn on all warnings   
```
target_compile_options(${PROJECT_NAME} PRIVATE
        $<$<CXX_COMPILER_ID:MSVC>:/W4 /WX>
        $<$<NOT:$<CXX_COMPILER_ID:MSVC>>:-Wall -Wextra -Wpedantic -Werror>
)

```
   
# Commands   
## Make project   
```
mkdir build
cd build
cmake ..
cmake --build .

```
   
   
## Check settings   
`cmake -L`     
`cmake -LH`    
   
## Build type   
`-DCMAKE\_BUILD\_TYPE=` Release, RelWithDebInfo, Debug   
   
## You forgot git submodules   
`git submodule update —init —recursive`    
   
