# LMS Chrome Extension (for PC / Chrome)

[![Known Vulnerabilities](https://snyk.io/test/github/Gumball12/lmsplusplus/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Gumball12/lmsplusplus?targetFile=package.json)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Gumball12/lmsplusplus/issues)

<p align="center">
  <img src="https://i.imgur.com/wj3LY1j.png" alt="thumbnail">
  <br>
  순천향대학교 사이버 강의 툴
</p>

> 이 확장 프로그램은 LMS 페이지 내 스크립트를 조작합니다. 따라서, LMS 서비스 제공 업체에서 스크립트 코드를 변경할 시 동작하지 않을 가능성이 있습니다.

* [설치 방법](#설치-방법)
* [사용 방법](#사용-방법)
* [추가 예정 기능](#추가-예정-기능)
* [동작 확인](#동작-확인)
* [변경사항](#변경사항)

의견 또는 문제 발생 시 [이슈](https://github.com/Gumball12/lms-playbackrate-extension/issues) 페이지를 이용해주세요.

감사합니다.

## 설치 방법

### 배포 버전

일반적인 경우에는 배포 버전으로 설치해주세요.

[이 링크](https://chrome.google.com/webstore/detail/lms%20%20/kdnnjmhhabnalhbpppkocnplmmebmobh) 를 클릭해 크롬 웹 스토어에서 다운로드 및 설치가 가능합니다.

### 개발 버전

> 개발 및 테스트를 위한 설치 방법입니다. 일반적인 경우에는 배포 버전으로 설치해주세요.

개발 버전 설치 방법은 다음과 같습니다.

1. [소스 코드를 다운로드](https://github.com/Gumball12/lmsplusplus/archive/master.zip) 받고, 압축을 해제합니다.
1. 크롬 확장 프로그램 관리 페이지(chrome://extensions)에 접속한 뒤, 우측 상단에 위치한 `개발자 모드`를 활성화합니다.
1. 좌측 상단의 `압축해제된 확장 프로그램을 로드합니다.` 버튼을 클릭합니다.
1. 압축 해제한 소스 코드의 폴더를 선택합니다.

## 사용 방법

<p align="center">
  <img src="./images/favicon-128x128.png" alt="favicon">
</p>

설치 후, 우측 상단의 아이콘을 클릭하여 사용이 가능합니다.

### 로그인 유지

<p align="center">
  <img src="https://i.imgur.com/WzT0shn.png" height="220">
</p>

일정 시간이 지나도 자동으로 로그아웃되지 않게끔 하는 기능입니다.

'켜짐' 상태가 되면 지속적으로 신호를 보내 로그아웃되지 않게끔 합니다.

#### 유의사항

* 강의 페이지(lms.sch.ac.kr)를 닫지 말아주세요.

### 동영상 속도 및 위치 변경

<p align="center">
  <img src="https://i.imgur.com/KBfKjrw.png" height="220">
  <br>
  <img src="https://i.imgur.com/deD2cq1.png" alt="playback-rate panel" height="220">
</p>

강의를 모두 듣지 않고도 강의 동영상의 속도 및 위치를 변경할 수 있게 합니다.

#### 유의사항

* 실제 수강 시간은 배속이 아닌 정상적인 속도로 시청한 시간이 적용됩니다.

### 이 강의 다운로드

<p align="center">
  <img src="https://i.imgur.com/Doev26S.png" alt="download this video" height="220">
</p>

원본 비디오 링크를 이용하여 해당 강의를 다운로드합니다.

1. `동영상 속도 및 위치 변경` 기능을 켜 주세요
1. 다운로드를 원하는 강의 영상에 접속해주세요
1. 확장 프로그램 아이콘을 누른 뒤, '이 강의 다운로드' 버튼을 클릭해주세요

### 강의 비디오 주소

<p align="center">
  <img src="https://i.imgur.com/tDa9zPR.png" height="220">
</p>

간혹 `이 강의 다운로드` 기능이 정상적으로 동작하지 않을 때가 있습니다.

이 경우, 강의 비디오 주소를 이용하여 다운로드가 가능합니다.

1. 강의 비디오의 주소를 클릭하여 선택한 뒤, 복사해주세요
1. 복사한 주소를 인터넷 창에 붙여넣기해주세요
1. 우측 하단 메뉴 버튼을 클릭한 뒤, `다운로드` 해주세요

사진으로 보면 다음과 같습니다.

<p align="center">
  <img src="https://i.imgur.com/CkctUQ7.png" height="180">
  <img src="https://i.imgur.com/JpQBmKB.png" height="180">
</p>

#### 유의사항

* `이 강의 다운로드` 기능이 정상적으로 동작하지 않는다면, 아래의 '강의 비디오 주소'를 복사한 뒤
* 인터넷 주소창에 

## 변경사항

### 버전 1.0

* 로그인 유지 기능 추가
* 동영상 속도 변경 기능 추가

### 버전 1.1

* 동영상 속도 변경 기능 삭제
    * 속도 및 위치 변경 기능으로 통합했습니다.
* 동영상 속도 및 위치 변경 기능 추가
* 로그인 유지 기능 변경
    * 로그인 유지를 위해 서버에 메시지를 10초마다 보냈으나, 이를 30초로 변경했습니다.

### 버전 1.2

* 강의 다운로드 기능 추가
* 기타 버그 제거 및 UI/코드 리팩토링
