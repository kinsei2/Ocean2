/* =================================
   Marine AI 부산 해양정보 시스템
================================= */


/* =================================
   기본 설정
================================= */


const BUSAN = {

    lat: 35.1796,

    lng: 129.0756

};


// API KEY 입력 위치

const API_CONFIG = {

    weatherKey : "YOUR_WEATHER_API_KEY",

    fisheriesKey : "YOUR_NIFS_API_KEY"

};



/* =================================
   현재 시간 표시
================================= */


function updateTime(){

    const now = new Date();

    document.getElementById(
        "timeText"
    ).innerText =
        now.toLocaleString("ko-KR");

}


setInterval(updateTime,1000);

updateTime();



/* =================================
   Leaflet 지도 생성
================================= */


const map = L.map("map")
.setView(
    [
        BUSAN.lat,
        BUSAN.lng
    ],
    11
);



L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

    maxZoom:19,

    attribution:
    "© OpenStreetMap"

}

).addTo(map);





/* =================================
   부산 주요 항구 표시
================================= */


const harbors = [

{

name:"감천항",

lat:35.052,

lng:129.003

},

{

name:"다대포",

lat:35.048,

lng:128.966

},

{

name:"기장",

lat:35.244,

lng:129.214

},

{

name:"송정",

lat:35.178,

lng:129.199

}

];



harbors.forEach(
(h)=>{


const marker =
L.marker(
[
h.lat,
h.lng
]

)

.addTo(map);



marker.bindPopup(

`
<b>${h.name}</b><br>

조업 정보 확인 가능

`

);


}

);



/* =================================
   GPS 현재 위치
================================= */


function getGPS(){


if(
navigator.geolocation
){


navigator.geolocation.getCurrentPosition(

(position)=>{


const lat =
position.coords.latitude;


const lng =
position.coords.longitude;



document.getElementById(
"locationText"
)

.innerText =

`
현재 위치:
${lat.toFixed(4)},
${lng.toFixed(4)}

`;



L.marker(
[
lat,
lng
]

)

.addTo(map)

.bindPopup(

"현재 선박 위치"

)

.openPopup();



map.setView(
[
lat,lng
],
13
);


},


(error)=>{


document.getElementById(
"locationText"
)

.innerText =

"GPS 정보를 사용할 수 없습니다.";


}


);



}

}


getGPS();



/* =================================
   테스트 해양 데이터
   (API 연결 전 임시)
================================= */


let oceanData = {


waterTemp:18.5,

wind:4.2,

wave:0.8,

salinity:32.1,

airTemp:22,

weather:"맑음"


};



function updateOceanUI(){



document.getElementById(
"waterTemp"
).innerText =
oceanData.waterTemp;



document.getElementById(
"windSpeed"
).innerText =
oceanData.wind;



document.getElementById(
"waveHeight"
).innerText =
oceanData.wave;



document.getElementById(
"salinity"
).innerText =
oceanData.salinity;



document.getElementById(
"airTemp"
).innerText =
oceanData.airTemp;



document.getElementById(
"weather"
).innerText =
oceanData.weather;



}



updateOceanUI();



/* =================================
   Chart.js 수온 그래프
================================= */


const tempChart =

new Chart(

document
.getElementById(
"tempChart"
),

{


type:"line",


data:{


labels:[

"06시",

"09시",

"12시",

"15시",

"18시"

],


datasets:[{


label:"수온 ℃",


data:[

17.8,

18.1,

18.5,

18.7,

18.4

],


tension:0.3


}]


},


options:{


responsive:true


}


}

);





/* =================================
   파고 그래프
================================= */


const waveChart =

new Chart(

document
.getElementById(
"waveChart"
),

{


type:"line",


data:{


labels:[

"06시",

"09시",

"12시",

"15시",

"18시"

],


datasets:[{


label:"파고 m",


data:[

0.5,

0.7,

0.8,

1.0,

0.8

],


tension:0.3


}]


},


options:{


responsive:true


}


}

);
/* =================================
   기상청 API 연동 구조
================================= */


async function getWeatherData(){


/*

실제 사용 시:

https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst

기상청 단기예보 API 사용

*/


try{


const url =

`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst
?serviceKey=${API_CONFIG.weatherKey}
&numOfRows=100
&pageNo=1
&dataType=JSON
&base_date=20260728
&base_time=0600
&nx=98
&ny=76`;


// 실제 API 키 입력 후 활성화

/*
const response =
await fetch(url);

const data =
await response.json();

console.log(data);
*/


console.log(
"기상청 API 연결 준비 완료"
);


}

catch(error){


console.error(
"기상청 데이터 오류",
error
);


}


}




/* =================================
   국립수산과학원 API 구조
================================= */


async function getFisheryData(){


/*

국립수산과학원:

- 수온
- 염분
- 해양환경
- 어장정보

API 연결 위치

*/


try{


const url =

`
https://apis.data.go.kr/1192000/openapi/service
`;


/*

실제 서비스 키 입력 후

fetch(url)

*/


console.log(

"국립수산과학원 API 연결 준비 완료"

);



}


catch(error){


console.error(
"수산 데이터 오류",
error
);


}



}




/* =================================
   AI 어종 추천 알고리즘
================================= */


/*

실제 AI 모델 연결 전

환경 기반 추천 알고리즘

입력:

수온
파고
풍속
계절


*/


function recommendFish(){



let temp =
oceanData.waterTemp;


let wave =
oceanData.wave;


let wind =
oceanData.wind;



let result = {

fish:"",

reason:""

};




if(
temp >= 17 &&
temp <=22 &&
wave <1
){


result.fish =
"고등어";


result.reason =

"현재 수온과 잔잔한 파도 조건이 고등어 활동 환경과 적합합니다.";


}



else if(

temp >=13 &&
temp <=18

){


result.fish =
"멸치";


result.reason =

"저수온 환경에서 멸치 어군 형성 가능성이 있습니다.";


}



else if(

temp >=20

){


result.fish =
"오징어";


result.reason =

"높은 수온 조건에서 오징어 어장이 형성될 가능성이 있습니다.";


}



else{


result.fish =
"갈치";


result.reason =

"현재 조건에서 갈치 조업 가능성을 확인하세요.";


}




document
.getElementById(
"fishName"
)

.innerText =
result.fish;




document
.getElementById(
"fishReason"
)

.innerText =
result.reason;



}



recommendFish();




/* =================================
   조업 추천 점수 계산
================================= */


function calculateScore(){



let score = 100;



// 바람

if(
oceanData.wind >8
){

score -=30;

}

else if(
oceanData.wind >5
){

score -=15;

}



// 파도

if(
oceanData.wave >2
){

score -=40;

}

else if(
oceanData.wave >1
){

score -=20;

}



// 수온

if(
oceanData.waterTemp <10 ||
oceanData.waterTemp >28
){

score -=15;

}



if(score <0)
score=0;



document
.getElementById(
"fishScore"
)

.innerText =
score;




let comment="";


if(score>=80){

comment =
"조업 환경이 매우 좋습니다.";

}

else if(score>=50){

comment =
"주의하며 조업 가능합니다.";

}

else{

comment =
"출항 전 해상 상태 확인이 필요합니다.";

}



document
.getElementById(
"scoreComment"
)

.innerText =
comment;



}



calculateScore();




/* =================================
   위험도 판정
================================= */


function checkDanger(){



const gauge =
document
.getElementById(
"dangerGauge"
);



let danger =
"안전";



gauge.className =
"gauge safe";



if(

oceanData.wave >2 ||
oceanData.wind >10

){


danger =
"위험";


gauge.className =
"gauge danger";


}



else if(

oceanData.wave >1 ||
oceanData.wind >6

){


danger =
"주의";


gauge.className =
"gauge warning";


}




gauge.innerText =
danger;



}




checkDanger();




/* =================================
   새로고침 버튼
================================= */


document
.getElementById(
"refreshBtn"
)

.addEventListener(

"click",

()=>{


getWeatherData();

getFisheryData();

recommendFish();

calculateScore();

checkDanger();



document
.getElementById(
"noticeBox"
)

.innerText =

"최신 해양 데이터를 다시 분석했습니다.";



}

);




/* =================================
   초기 실행
================================= */


async function init(){


await getWeatherData();

await getFisheryData();



}



init();
