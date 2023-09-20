const plugin = ({ widgets, simulator, vehicle }) => {
    var firstRunFlag = true;
    var txt = readTextFile("https://xavierdai.github.io/ident.txt");
    var allDriverDictionary = analysisTxt(txt);
    var defaultDriverDictionary = pasteToNewDictionary(
      allDriverDictionary["NBAPlayer"]
    );
    var originalCustomDictionary = pasteToNewDictionary(
      allDriverDictionary["Custom"]
    );
    var customizedDictionary = pasteToNewDictionary(originalCustomDictionary);
    var systemDictionary = pasteToNewDictionary(defaultDriverDictionary);
    // console.log(originalCustomDictionary);
    // live args
    var selectedDriverName = null;
    var isPersonal = false;
    var OutsideTemperature = 20;
    var rainIntensity = null;
    var previousSelectedDriverName = null;
    var ACOnOff = false;
    // auto save
    // var welcomeWord = null;
    // var language = null;
    // var UIInterface = null;
    // var USMetricUnit = null;
    var interiorLight = null;
    // var parkingBeepLevel = null;
    // var musicURI = null;
    // var ADASBeepLevel = null;
  
    // with a on/off switch
    // var mirrorLeftTilt = null;
    // var mirrorLeftPan = null;
    // var mirrorRightTilt = null;
    // var mirrorRightPan = null;
    // var ACAirFlowLevel = null;
    // var ACTemperature = null;
    // var ACTemperatureIfHot = null;
    // var ACTemperatureIfCold = null;
    // var SteeringWheelWarm = null;
    // var SeatHeatLevel = null;
    // var SeatVentilation = null;
    var AutoHoldIsOn = null;
    var SteeringMode = null;
    var BrakingMode = null;
    var PowerMode = null;
  
    var driveMode = null;
  
    var signalList = [
      "Cabin.Door.Row1.Left.IsOpen",
      "Vehicle.Cabin.Seat.Row1.Pos1.Height",
    ];
  
    var languageDictionary = {
      Settings: {
        German: "Einstellungen:",
        Chinese: "设置",
        English: "Settings:",
        Spanish: "Configuración",
      },
      Welcome: {
        German: "Willkommen",
        Chinese: "欢迎您",
        English: "Welcome",
        Spanish: "Bienvenido",
      },
      "Enable-MySettings": {
        German: "Meine Einstellungen aktivieren:",
        Chinese: "开启 MySettings:",
        English: "Enable MySettings:",
        Spanish: "Habilitar mi configuración",
      },
      "Alter-your-Screen": {
        German: "Ändern Sie Ihren Bildschirm",
        Chinese: "调整你的屏幕",
        English: "Alter your Screen",
        Spanish: "Ajustar tu pantalla",
      },
      "Welcome-Word": {
        German: "Willkommenswort",
        Chinese: "欢迎语",
        English: "Welcome Words",
        Spanish: "Palabras de bienvenida",
      },
      Language: {
        German: "Sprache",
        Chinese: "语言",
        English: "Languages",
        Spanish: "Idiomas",
      },
      "Alter-your-Environment": {
        German: "Ändern Sie Ihre Umgebung",
        Chinese: "调整环境",
        English: "Alter your Environment",
        Spanish: "Ajustar el entorno",
      },
      "US-Metric-Units": {
        German: "US/metrische Einheiten",
        Chinese: "美/英制单位",
        English: "US/Metric Units",
        Spanish: "Unidades imperials tradicionales de Estados Unidos",
      },
      "Interior-Light": {
        German: "Innenbeleuchtung",
        Chinese: "内部灯光",
        English: "Interior Light",
        Spanish: "Iluminación interior",
      },
      "Parking-Beep-Level": {
        German: "Parking Piep",
        Chinese: "停车警示音量",
        English: "Parking Beep",
        Spanish: "Volumen de los pitidos de aparcamiento",
      },
      "Preferred-Music": {
        German: "Musik",
        Chinese: "喜欢的音乐",
        English: "Music",
        Spanish: "Música preferida",
      },
      "ADAS-Beep-Level": {
        German: "ADAS Signalpegel",
        Chinese: "ADAS警示音量",
        English: "ADAS Beep",
        Spanish: "Volumen de los pitidos ADAS",
      },
      "Save-changes-listed-below": {
        German: "Die unten aufgeführten Änderungen speichern?",
        Chinese: "舒适设置",
        English: "Comfort Settings",
        Spanish: "¿ Guardar los cambios que se indican a continuación?",
      },
      "Seat-Position": {
        German: "Sitzposition",
        Chinese: "座椅位置",
        English: "Seat Position",
        Spanish: "Posición del asiento",
      },
      "AC-temperature": {
        German: "Wechselstromtemperatur",
        Chinese: "空调温度",
        English: "AC temperature",
        Spanish: "Temperatura del aire acondicionado",
      },
      "AC-Air-Flow-Level": {
        German: "Luftstrompegel",
        Chinese: "空调风速等级",
        English: "AC Air Flow Level",
        Spanish: "AC velocidad del aire",
      },
      "Steering-Wheel-Warm": {
        German: "Lenkrad warm",
        Chinese: "方向盘加热程度",
        English: "Steering Wheel Warm",
        Spanish: "nivel de calefacción del volante",
      },
      "Seat-Heat-Level": {
        German: "Sitzheizung",
        Chinese: "座椅加热程度",
        English: "Seat Heat Level",
        Spanish: "nivel de calefacción del asiento",
      },
      "Seat-Ventilation": {
        German: "Sitzbelüftung",
        Chinese: "座椅透气",
        English: "Seat Ventilation",
        Spanish: "Ventilación del asiento",
      },
      Driving: {
        German: "Autofahren",
        Chinese: "驾驶",
        English: "Driving Settings",
        Spanish: "Conducir",
      },
      AutoHold: {
        German: "Handbremse",
        Chinese: "自动停启",
        English: "AutoHold",
        Spanish: "Retención automática",
      },
      "Mirror-Status": {
        German: "Rückspiegelstatus",
        Chinese: "后视镜状态",
        English: "Mirror Status",
        Spanish: "estado del espejo retrovisor",
      },
      "Drive-Mode": {
        German: "Fahrmodus",
        Chinese: "驾驶模式",
        English: "Drive Mode",
        Spanish: "Modo de conducción",
      },
      "One-Puddle-Drive": {
        German: "Single Pedal Modus",
        Chinese: "单踏板模式",
        English: "One Puddle Drive",
        Spanish: "Modo de pedal único",
      },
    };
    var musicDictionary = {
      yellow: {
        imageURL: "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FR.png?alt=media&token=8be6fe0e-e6c0-4880-b538-4703bcfacedd",
        author: "Coldplay",
        mediaURL: "https://digitalauto.netlify.app/media",
      },
      XmasLight: {
        imageURL: "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FXL.png?alt=media&token=4b1a2c32-7b74-4dc4-a8ae-14c758332c4a",
        author: "Coldplay",
        mediaURL: "http://127.0.0.1:5500/img/XmasLight.mp3",
      },
    };
    var afterTempJudge = {
      val: "Set AC Air Flow",
      type: "activity",
      left: null,
      right: null,
      middle: {
        val: "Set ADAS warning beep level",
        type: "activity",
        left: null,
        right: null,
        middle: null,
      },
    };
    var personalTree = {
      val: "Set Seat Position",
      type: "activity",
      type: "activity",
      left: null,
      right: null,
      middle: {
        val: "Personalized Welcome Word",
        type: "activity",
        left: null,
        right: null,
        middle: {
          val: "Set Prefer Language",
          type: "activity",
          left: null,
          right: null,
          middle: {
            val: "Set US/Metric Units",
            type: "activity",
            left: null,
            right: null,
            middle: {
              val: "Set Interior Light",
              type: "activity",
              left: null,
              right: null,
              middle: {
                val: "Set Parking Warning Beep Level",
                type: "activity",
                left: null,
                right: null,
                middle: {
                  val: "Turn On Preferred Music",
                  type: "activity",
                  left: null,
                  right: null,
                  middle: {
                    val: "Set AutoHold",
                    type: "activity",
                    left: null,
                    right: null,
                    middle: {
                      val: "Set Mirror Status",
                      type: "activity",
                      left: null,
                      right: null,
                      middle: {
                        val: "Set One Puddle Drive",
                        type: "activity",
                        left: null,
                        right: null,
                        middle: {
                          val: "Set Drive Mode",
                          type: "activity",
                          left: null,
                          right: null,
                          middle: {
                            val: "Get Outside Temperature",
                            type: "activity",
                            left: null,
                            right: null,
                            middle: {
                              val: {
                                state: "temp < 9",
                                leftCondition: "Yes",
                                middleCondition: "No",
                                rightCondition: null,
                              },
                              type: "judge",
                              left: {
                                val: "Turn on & Set AC",
                                type: "activity",
                                left: null,
                                right: null,
                                middle: {
                                  val: "Turn on Seat Heat",
                                  type: "activity",
                                  left: null,
                                  right: null,
                                  middle: {
                                    val: "Turn Steering Wheel Warm",
                                    type: "activity",
                                    left: null,
                                    right: null,
                                    middle: afterTempJudge,
                                  },
                                },
                              },
                              right: null,
                              middle: {
                                val: {
                                  state: "temp > 25",
                                  leftCondition: "Yes",
                                  middleCondition: "No",
                                  rightCondition: null,
                                },
                                type: "judge",
                                left: {
                                  val: "Turn on & Set AC",
                                  type: "activity",
                                  left: null,
                                  right: null,
                                  middle: {
                                    val: "Turn On Seat Ventilation",
                                    type: "activity",
                                    left: null,
                                    right: null,
                                    middle: afterTempJudge,
                                  },
                                },
                                right: null,
                                middle: afterTempJudge,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };
    const flowChartTree = {
      val: "Vehicle Key Detection",
      type: "activity",
      left: null,
      right: null,
      middle: {
        val: "Driver Identification",
        type: "activity",
        left: null,
        right: null,
        middle: {
          val: "Check Memory Data",
          type: "activity",
          left: null,
          right: null,
          middle: {
            val: {
              state: "Driver Memory",
              leftCondition: "Custom",
              middleCondition: "NBAPlayer",
              rightCondition: "Wife",
            },
            type: "judge",
            left: {
              val: "Customize Your Own Driver",
              type: "activity",
              left: null,
              right: null,
              middle: personalTree,
            },
            right: {
              val: "Pull Driver Wife",
              type: "activity",
              left: null,
              right: null,
              middle: personalTree,
            },
            middle: {
              val: "Pull Driver NBA Player",
              type: "activity",
              left: null,
              right: null,
              middle: personalTree,
            },
          },
        },
      },
    };
    var curTree = flowChartTree;
  
    // widget for setting1
    const personalSettingModule = document.createElement("div");
    personalSettingModule.setAttribute(
      "style",
      `height: 100%; width: calc(100% - 10px);margin-left:10px;`
    );
    personalSettingModule.innerHTML = `
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                  .phone-container::-webkit-scrollbar{
                      width:8px;
                      height:40px;
                  }
              
                  .phone-container::-webkit-scrollbar-thumb{
                      -webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.1);
                      border-radius:15px;
                      background:rgba(0,0,0,0.1);
                  }
                  .phone-container::-webkit-scrollbar-thumb:hover{
                      background:rgba(0,0,0,0.2);
                  }
                  .phone-container::-webkit-scrollbar-track{
                      -webkit-box-shadow:inset 0 0 0px rgba(0,0,0,0.0);
                      border-radius:5px;
                      background:rgba(0,0,0,0.0);
                  }
                  .phone-container::-webkit-scrollbar-track:hover{
  
                      background:rgba(0,0,0,0.1);
                  }
                  .form-check-input:hover{
                      cursor:pointer;
                  }
                  .top-phone-box:after{
                      content: "";
                      display: block;
                      clear:both;
  
                  }
                  .setting-table{
                      font-size:5vw;
                  }
                  .setting-h1{
                      font-size:8vw;
                  }
                  .setting-h3{
                      font-size:6vw;
                  }
                  .form-select{
                    padding:.375rem 1rem .375rem .75rem;
                    background-position:right center;
                  }
              </style>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
          </head>
  
          <body>
          <div style="background-color:#F1F1F1;border:3vw solid black;border-radius:12vw;height:100%;overflow-y:hidden">
          <div id="top-phone-box"style="height：15%">
              <h1 class="setting-h1 language-switch" id="Settings" style="margin-left:20px;margin-top:5px;">
                  Settings:
              </h1>
              <div style="background-color:white;border-radius:20px;margin-left:10px;margin-right:15px;margin-top:5px">
              <table class = "table setting-table">
              <tbody>
                  <tr>
    
                      <td>
                              <div class="container">
                                  <div class="row row-cols-auto">
                                      <div class="col">
                                          <div id="avatar" style="margin-top:5px;width:7vh;height:7vh;border-radius:3.5vh 3.5vh 3.5vh 3.5vh;background-size:7vh 7vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FDrowsiness_2.png?alt=media&token=c085c451-ec32-4579-b3bf-1b77108f1c81);">
                                          </div>
                                      </div>
                                      <div class="col">
                                          <span style="font-size:6vw">
                                              Hi, 
                                          </span>
                                          <span id="driver-name-span" style="font-size:6vw">
                                              Driver!
                                          </span>
                                          </br>
                                          <span class="language-switch" id="Welcome" style="font-size:4vw">
                                              welcome
                                          </span>
                                      </div>
                                      
                                  </div>
                              </div>
                      </td>
                  </tr>
                  <tr>
                      <td>
                              <span class="float-start language-switch" id="Enable-MySettings" style="margin-left:8px">
                                  Enable MySettings:
                              </span>
                              <div class="form-switch clearfix">
                              <input class="form-check-input float-end driver-input-child" type="checkbox" role="switch"  id="on-off-button" checked>
                      </td>
                  </tr>
               
                  
  
              </tbody>
          </table>
          </div>
          </div>
          
  
          <div class="phone-container" style="height:calc(78% - 25px);overflow-y:auto;margin-top:5px;margin-bottom:15px;">
              
  
  
              <h3 class="setting-h3" id="Alter-your-Screen" style="margin-left:20px;">Alter your Screen</h3>
              <div style="background-color:white;border-radius:10px;margin-left:10px;margin-right:10px;margin-top:5px;">
              <table class = "table setting-table">
                  <tbody>
                      <tr>
        
                          <td>
                                  <span class="float-start language-switch" id="Welcome-Word" style="margin-left:8px">
                                      Welcome Word
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input driver-input-child float-end setting-checkbox-child" type="checkbox" role="switch" id="welcomeWordCheck">
                                  </div>
                          </td>
                      </tr>
                      <tr>
                
                          <td>
                          <div class="row g-3 align-items-center">
                                  <div class="col-7">
  
                                      <span class="float-start language-switch" id="Language" style="margin-left:8px">
                                        Language
                                      </span>
                                      <img src="https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Flanguage.png?alt=media&token=673590b2-ce53-4f9b-9976-4ec1669b31cb" style="width:5vw;height:5vw;margin-left:1vw;margin-top:1vw;">
                                  </div>
                                  <div class="col-5">
                                      <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="LanguageSelect" style="font-size:4vw;background-size:3vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                        <option id="English" value="English">English</option>    
                                        <option id="Chinese" value="Chinese">中文</option>
                                        <option id="German" value="German">Deutsch</option>
                                        <option id="Spanish" value="Spanish">español</option>
                                      </select>
                                  </div>
                                  
                          </div>
                                  
                                 
                          </td>
                      </tr>
                      
  
                      <tr>
               
                          <td>
                              <div class="row g-3 align-items-center">
                                      <div class="col-7">
                                          <span class="float-start language-switch" id="US-Metric-Units" style="margin-left:8px">
                                          US/Metric Units
                                          </span>
                                      </div>
                                      <div class="col-5">
                                          <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="UnitSelect" style="font-size:4vw;background-size:3vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                            <option id="Metric" value="Metric">Metric</option>
                                              <option id="US" value="US">US</option>
                                              
                                              
                                          </select>
                                      </div>
                                      
                              </div>
                              
                          </td>
                      </tr>
  
                  </tbody>
              </table>
              </div>
  
  
  
              <h3 class="setting-h3" id="Alter-your-Environment" style="margin-left:20px;">Alter your Environment</h3>
              <div style="background-color:white;border-radius:10px;margin-left:10px;margin-right:10px;margin-top:5px">
              <table class = "table setting-table">
                  <tbody>
                      <tr>
        
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-7">
                                      <span class="float-start language-switch" id="Interior-Light" style="margin-left:8px">
                                          Interior Light
                                      </span>
                                  </div>
                                  <div class="col-5">
                                      <div class="form-switch clearfix">
                                  
                                          <input type="color" class="form-control form-control-color form-control-sm float-end setting-checkbox-child driver-input-child" id="InteriorLightColor" value="#563d7c" title="Choose your color">
                                      </div>
                                  </div>
                              </div>
                          </td>
                      </tr>
                      <tr>
                
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-7">
                                      <span class="float-start language-switch" id="Parking-Beep-Level" style="margin-left:8px">
                                          Parking Beep
                                      </span>
                                  </div>
                                  <div class="col-5" >
                                      <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="ParkingBeepLevelSelect" style="font-size:4vw;background-size:3vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                          <option id="optionParkingLow" value="Low">Low</option>
                                          <option id="optionParkingMedium" value="Medium">Medium</option>
                                          <option id="optionParkingHigh" value="High">High</option>
                                          <option id="optionParkingOff" value="Off">Off</option>
                                      </select>
                                  </div>
                              
                              </div>
                          </td>
                      </tr>
                      <tr>
               
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-6">
                                      <span class="float-start language-switch" id="Preferred-Music" style="margin-left:8px">
                                          Music
                                      </span>
                                  </div>
                                  <div class="col-6">
                                      <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="PreferredMusicSelect" style="font-size:4vw;background-size:3vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                          <option id="optionYellow" value="yellow">yellow</option>
                                          <option id="optionXmasLight" value="XmasLight">XmasLight</option>
                                          
                                      </select>
                                  </div>
                              
                              </div>
                                 
                                      
                          </td>
                      </tr>
                      <tr>
               
                      <td>
                          <div class="row g-3 align-items-center">
                              <div class="col-7">
                                  <span class="float-start language-switch" id="ADAS-Beep-Level" style="margin-left:8px">
                                      ADAS Beep
                                  </span>
                              </div>
                              <div class="col-5">
                                  <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="ADASBeepLevelSelect" style="font-size:4vw;background-size:3vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                      <option id="optionADASLow" value="Low">Low</option>
                                      <option id="optionADASMedium" value="Medium">Medium</option>
                                      <option id="optionADASHigh" value="High">High</option>
                                      <option id="optionADASOff" value="Off">Off</option>
                                  </select>
                              </div>
                          
                          </div>
                             
                      </td>
                  </tr>
                  </tbody>
              </table>
              </div>
  
  
  
  
              <h3 class="setting-h3 language-switch" id="Save-changes-listed-below" style="margin-left:20px;">Comfort Settings</h3>
              <div style="background-color:white;border-radius:10px;margin-left:10px;margin-right:10px;margin-top:5px">
              <table class = "table setting-table">
                  <tbody>
                      <tr>
        
                          <td>
                                  <span class="float-start language-switch" id="Seat-Position" style="margin-left:8px">
                                  Seat Position
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="SeatPositionCheck">
                                  </div>
                          </td>
                      </tr>
                      <tr>
                
                          <td>
                                  <span class="float-start language-switch" id="AC-temperature" style="margin-left:8px">
                                  AC temperature
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="ACTemperatureCheck">
                                  </div>
                          </td>
                      </tr>
                      <tr>
               
                          <td>
  
                                  <span class="float-start language-switch" id="AC-Air-Flow-Level" style="margin-left:8px">
                                  AC Air Flow Level 
                                      </span>
                                      <div class="form-switch clearfix">
                                          <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="ACAirFlowLevelCheck">
                                      </div>
                          </td>
                      </tr>
                      <tr>
               
                      <td>
  
                              <span class="float-start language-switch" id="Steering-Wheel-Warm" style="margin-left:8px">
                              Steering Wheel Warm
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="SteeringWheelWarmCheck">
                                  </div>
                      </td>
                       </tr>
                       <tr>
               
                      <td>
  
                              <span class="float-start language-switch" id="Seat-Heat-Level" style="margin-left:8px">
                              Seat Heat Level
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="SeatHeatLevelCheck">
                                  </div>
                      </td>
                       </tr>
                       <tr>
               
                      <td>
  
                              <span class="float-start language-switch" id="Seat-Ventilation" style="margin-left:8px">
                              Seat Ventilation
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="SeatVentilationCheck">
                                  </div>
                      </td>
                       </tr>
                  </tbody>
              </table>
              </div>
  
  
  
  
              <h3 class="setting-h3 language-switch" id="Driving" style="margin-left:20px;">Driving Settings</h3>
              <div style="background-color:white;border-radius:10px;margin-left:10px;margin-right:10px;margin-top:5px">
              <table class = "table setting-table">
                  <tbody>
                      <tr>
        
                          <td>
                                  <span class="float-start language-switch" id="AutoHold" style="margin-left:8px">
                                      AutoHold
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="AutoHoldCheck">
                                  </div>
                          </td>
                      </tr>
                      <tr>
                
                          <td>
                                  <span class="float-start language-switch" id="Mirror-Status" style="margin-left:8px">
                                      Mirror Status
                                  </span>
                                  <div class="form-switch clearfix">
                                      <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="MirrorStatusCheck">
                                  </div>
                          </td>
                      </tr>
                      <tr>
               
                          <td>
  
                                  <span class="float-start language-switch" id="Drive-Mode" style="margin-left:8px">
                                    Drive Mode
                                      </span>
                                      <div class="form-switch clearfix">
                                          <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="DriveModeCheck">
                                      </div>
                          </td>
                      </tr>
                      <tr>
               
                          <td>
  
                                  <span class="float-start language-switch" id="One-Puddle-Drive"style="margin-left:8px">
                                    One Puddle Drive
                                      </span>
                                      <div class="form-switch clearfix">
                                          <input class="form-check-input float-end setting-checkbox-child driver-input-child" type="checkbox" role="switch" id="OnePuddleCheck">
                                      </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
              </div>
  
  
  
  
  
          </div>
          </div>
  
  
              <script src=https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
          </body>    
          `;
  
    // Accessing the on/off button
    var onOffButton = personalSettingModule.querySelector("#on-off-button");
  
    var welcomeWordCheck =
      personalSettingModule.querySelector("#welcomeWordCheck");
  
    var ParkingWarningBeepLevelCheck = personalSettingModule.querySelector(
      "#ParkingWarningBeepLevelCheck"
    );
    var PreferredMusicCheck = personalSettingModule.querySelector(
      "#PreferredMusicCheck"
    );
    var SeatPositionCheck =
      personalSettingModule.querySelector("#SeatPositionCheck");
    var AutoHoldCheck = personalSettingModule.querySelector("#AutoHoldCheck");
    var MirrorStatusCheck =
      personalSettingModule.querySelector("#MirrorStatusCheck");
    var DriveModeCheck = personalSettingModule.querySelector("#DriveModeCheck");
  
    var OnePuddleCheck = personalSettingModule.querySelector("#OnePuddleCheck");
    var ACTemperatureCheck = personalSettingModule.querySelector(
      "#ACTemperatureCheck"
    );
    var ACAirFlowLevelCheck = personalSettingModule.querySelector(
      "#ACAirFlowLevelCheck"
    );
    var SteeringWheelWarmCheck = personalSettingModule.querySelector(
      "#SteeringWheelWarmCheck"
    );
    var SeatHeatLevelCheck = personalSettingModule.querySelector(
      "#SeatHeatLevelCheck"
    );
    var SeatVentilationCheck = personalSettingModule.querySelector(
      "#SeatVentilationCheck"
    );
    var LanguageSelect = personalSettingModule.querySelector("#LanguageSelect");
    var UnitSelect = personalSettingModule.querySelector("#UnitSelect");
  
    var InteriorLightColor = personalSettingModule.querySelector(
      "#InteriorLightColor"
    );
    var PreferredMusicSelect = personalSettingModule.querySelector(
      "#PreferredMusicSelect"
    );
    var ParkingBeepLevelSelect = personalSettingModule.querySelector(
      "#ParkingBeepLevelSelect"
    );
    var ADASBeepLevelSelect = personalSettingModule.querySelector(
      "#ADASBeepLevelSelect"
    );
    // Event listener for the on/off button click
    onOffButton.addEventListener("click", function (event) {
      var isOn = event.target.checked;
      // console.log("On/Off:", isOn);
      let childrenList = personalSettingModule.querySelectorAll(
        ".setting-checkbox-child"
      );
      if (isOn == true) {
        for (let item of childrenList) {
          if (item.getAttribute("disabled")) {
            item.removeAttribute("disabled");
          }
        }
      } else {
        for (let item of childrenList) {
          item.setAttribute("disabled", "disabled");
        }
        Object.entries(systemDictionary).forEach(([key, value]) => {
          value.onOff = false;
        });
        personalSettingModule.querySelector("#SeatPositionCheck").checked = false;
        personalSettingModule.querySelector(
          "#ACTemperatureCheck"
        ).checked = false;
        personalSettingModule.querySelector(
          "#ACAirFlowLevelCheck"
        ).checked = false;
        personalSettingModule.querySelector(
          "#SteeringWheelWarmCheck"
        ).checked = false;
        personalSettingModule.querySelector(
          "#SeatHeatLevelCheck"
        ).checked = false;
        personalSettingModule.querySelector(
          "#SeatVentilationCheck"
        ).checked = false;
        personalSettingModule.querySelector("#AutoHoldCheck").checked = false;
        personalSettingModule.querySelector("#MirrorStatusCheck").checked = false;
        personalSettingModule.querySelector("#DriveModeCheck").checked = false;
        personalSettingModule.querySelector("#OnePuddleCheck").checked = false;
      }
    });
  
    welcomeWordCheck.addEventListener("click", function (event) {
      var isOn = event.target.checked;
      systemDictionary.welcomeWord.onOff = event.target.checked;
      // console.log("On/Off:", isOn);
    });
  
    SeatPositionCheck.addEventListener("click", function (event) {
      systemDictionary["seatPosition"].onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary["seatPosition"].onOff);
    });
    AutoHoldCheck.addEventListener("click", function (event) {
      var isOn = event.target.checked;
      systemDictionary.AutoHold.onOff = event.target.checked;
      // console.log("On/Off:", isOn);
    });
    MirrorStatusCheck.addEventListener("click", function (event) {
      systemDictionary.mirrorLeftTilt.onOff = event.target.checked;
      systemDictionary.mirrorLeftPan.onOff = event.target.checked;
      systemDictionary.mirrorRightTilt.onOff = event.target.checked;
      systemDictionary.mirrorRightPan.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.mirrorLeftTilt.onOff);
    });
    DriveModeCheck.addEventListener("click", function (event) {
      systemDictionary.driveMode.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.driveMode.onOff);
    });
    OnePuddleCheck.addEventListener("click", function (event) {
      systemDictionary.OnePuddle.onOff = event.target.checked;
      if(event.target.checked){
        systemDictionary.OnePuddle.val ="On";
      }else{
        systemDictionary.OnePuddle.val = "Off";
      }
  
    });
    ACAirFlowLevelCheck.addEventListener("click", function (event) {
      systemDictionary.ACAirFlowLevel.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.ACAirFlowLevel.onOff);
    });
    ACTemperatureCheck.addEventListener("click", function (event) {
      systemDictionary.ACTemperatureIfCold.onOff = event.target.checked;
      systemDictionary.ACTemperatureIfHot.onOff = event.target.checked;
      // console.log("On/Off:", event.target.checked);
    });
    SteeringWheelWarmCheck.addEventListener("click", function (event) {
      systemDictionary.SteeringWheelWarm.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.SteeringWheelWarm.onOff);
    });
    SeatHeatLevelCheck.addEventListener("click", function (event) {
      systemDictionary.SeatHeatLevel.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.SeatHeatLevel.onOff);
    });
  
    SeatVentilationCheck.addEventListener("click", function (event) {
      systemDictionary.SeatVentilation.onOff = event.target.checked;
      // console.log("On/Off:", systemDictionary.SeatVentilation.onOff);
    });
  
    LanguageSelect.onchange = function () {
      systemDictionary.language.val = this.value;
      systemDictionary.language.onOff = true;
      // console.log("language：", this.value);
      switchLanguage(this.value);
    };
  
    UnitSelect.onchange = function () {
      systemDictionary.USMetricUnit.val = this.value;
      systemDictionary.USMetricUnit.onOff = true;
      // console.log("Selected Unit:", this.value);
      changeTemperatureUnit(this.value);
    };
  
    PreferredMusicSelect.onchange = function () {
      systemDictionary.musicURI.val = this.value;
      systemDictionary.musicURI.onOff = true;
      // console.log("Selected Unit:", this.value);
    };
  
    InteriorLightColor.onchange = function () {
      // console.log("color：", this.value);
      systemDictionary.InteriorLight.onOff = true;
      systemDictionary.InteriorLight.val = this.value.replace("#", "");
      bigBoxModule.querySelector("#bottomLightDiv").style.boxShadow =
        "0px 0px 20px 10px " + this.value;
    };
  
    ParkingBeepLevelSelect.onchange = function () {
      systemDictionary.parkingBeepLevel.val = this.value;
      systemDictionary.parkingBeepLevel.onOff = true;
      // console.log("Parking Beep Level：", this.value);
    };
  
    ADASBeepLevelSelect.onchange = function () {
      systemDictionary.ADASBeepLevel.val = this.value;
      systemDictionary.ADASBeepLevel.onOff = true;
      // console.log("ADAS Beep Level：", this.value);
    };
  
    widgets.register("Setting1", (box) => {
      box.injectNode(personalSettingModule);
    });
  
    const flowChartModule = document.createElement("div");
    flowChartModule.innerHTML = `
      <head>
      <title>Tree Diagram</title>
      <style>
        
        
      .judge{
          width:10vw;
          height:10vw;
          -webkit-clip-path:polygon(0px 50%,50% 0px,100% 50%,50% 100%,0px 50%);
      }
      
        .topNode{
          height:13%;
          width:26%;
          position:absolute;
          left: calc(50% - 13%);
          top:10%;
          background-color:#71D5FF;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          border-radius: 3vw;
          border: 1px solid gray;
          font-size:4vw;
      }
        .middleNode {
          height:13%;
          width:26%;
            position:absolute;
            left: calc(50% - 13%);
            top:43.5%;
            background-color:#00A2E8;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            border-radius: 3vw;
            border: 1px solid gray;
            box-shadow:0px 0px 3px 3px #aaa;
            font-size:4vw ;
        }
        .bottomNode {
          height:13%;
          width:26%;
            position:absolute;
            left: calc(50% - 13%);
            top:75%;
            background-color:#71D5FF;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            border-radius: 3vw;
            border: 1px solid gray;
            font-size:4vw ;
        }
        .bottomLeftNode {
          height:13%;
          width:26%;
            position:absolute;
            left: calc(20% - 13%);
            top:75%;
            background-color:#71D5FF;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            border-radius: 3vw;
            border: 1px solid gray;
            font-size:4vw ;
        }
        .bottomRightNode {
          height:13%;
          width:26%;
            position:absolute;
            left: calc(80% - 13%);
            top:75%;
            background-color:#71D5FF;
            display:flex;
            align-items:center;
            justify-content:center;
            text-align:center;
            border-radius: 3vw;
            border: 1px solid gray;
            font-size:4vw ;
        }
      .stateSpan {
          position:absolute;
          left: 57%;
          top: 40%;
          font-size:4vw ;
      }
      .leftConditionSpan {
          position:absolute;
          left: 23%;
          top: 52%;
          font-size:4vw ;
      }
      .rightConditionSpan{
          position:absolute;
          left: 65%;
          top: 50%;
          font-size:4vw ;
      }
      
      .middleConditionSpan{
          position:absolute;
          left: 52%;
          top: 60%;
          font-size:4vw ;
      }
      .start{
          height:10vw;
          width:10vw;
          position:absolute;
          left: calc(50% - 5vw);
          border-radius:5vw 5vw 5vw 5vw;
          background-color:grey;
      }
      .end {
          height:10vw;
          width:10vw;
          left: calc(50% - 5vw);
            background-color:grey;
            text-align:center;
            border-radius:5vw 5vw 5vw 5vw;
            font-size:80% ;
        }
  
      </style>
    </head>
    <body>
    
        <div id="flowChart" style="position: block;">
          <div class="middleNode start">
          </div>
        </div>
  
      </body> 
      `;
  
    var drawFlag = true;
  
    var previousVal = null;
    var previousType = null;
    var moveDirection = null;
    function drawTree(tree) {
      var space = flowChartModule.querySelector("#flowChart");
      var html = "";
      var link = "";
      if (tree.left == null) {
        if (tree.right == null) {
          link =
            "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fmiddle.png?alt=media&token=40a862dc-6df5-40f2-aced-61906d9a2577";
        } else {
          link =
            "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2F3.png?alt=media&token=da075ded-47a1-45ac-a8b4-b3d5f1b59032";
        }
      } else {
        if (tree.right == null) {
          link =
            "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fleft.png?alt=media&token=d40ffc11-0602-41d4-b449-94221e7bc83d";
        } else {
          link =
            "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fall.png?alt=media&token=74576bf0-adf5-4a70-bfbb-8c97870ea4f0";
        }
      }
      html +=
        `
          <div style="height: 100%;width:100%;background-image:url(` +
        link +
        `);background-size: 100%;background-repeat:no-repeat;border-width:1px;border-color:#000">
          `;
      if (tree.type == "activity") {
        html +=
          `
              <div class="middleNode">
              ` +
          tree.val +
          `
              </div>
              `;
      } else if (tree.type == "judge") {
        html +=
          `
              <div class="middleNode judge">
              </div>
              <div class="stateSpan">
              ` +
          tree.val.state +
          `
              </div>
              <div class = "leftConditionSpan">
              ` +
          tree.val.leftCondition +
          `
              </div>
              <div class = "middleConditionSpan">
              ` +
          tree.val.middleCondition +
          `
              </div>
              <div class = "rightConditionSpan">
              ` +
          tree.val.rightCondition +
          `
              </div>
              `;
      }
  
      if (previousVal != null) {
        if (previousType == "activity") {
          html +=
            `
                  <div class="topNode">
                  ` +
            previousVal +
            `
                  </div>
                  `;
        } else if (previousType == "judge") {
          html += `
                  <div class="topNode judge">
                  </div>
                  `;
        }
      } else {
        html += `
              <div class="topNode start">
              </div>
              `;
      }
  
      if (tree.left != null) {
        if (tree.left.type == "activity") {
          html +=
            `
                  <div class="bottomLeftNode">
                  ` +
            tree.left.val +
            `
                  </div>
                  `;
        } else if (tree.left.type == "judge") {
          html += `
                  <div class="bottomLeftNode judge">
                  </div>
                  `;
        }
      }
      if (tree.right != null) {
        if (tree.right.type == "activity") {
          html +=
            `
                  <div class="bottomRightNode">
                  ` +
            tree.right.val +
            `
                  </div>
                  `;
        } else if (tree.right.type == "judge") {
          html +=
            `
                  <div class="bottomRightNode judge">
                  ` +
            tree.right.val +
            `
                  </div>
                  `;
        }
      }
      if (tree.middle != null) {
        if (tree.middle.type == "activity") {
          html +=
            `
                  <div class="bottomNode">
                  ` +
            tree.middle.val +
            `
                  </div>
                  `;
        } else if (tree.middle.type == "judge") {
          html += `
                  <div class="bottomNode judge">
                  </div>
                  `;
        }
      } else {
        drawFlag = false;
        html += `
              <div class="bottomNode end">
              </div>
              `;
      }
      html += `          </div>`;
      space.innerHTML = html;
      previousVal = tree.val;
      previousType = tree.type;
      // if (drawFlag) {
      //   setTimeout(function () {
      //     drawTree(tree.middle);
      //   }, 2000);
      // } else
      if (!drawFlag) {
        setTimeout(function () {
          var space = flowChartModule.querySelector("#flowChart");
          var html = "";
          var link =
            "https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fend.png?alt=media&token=a2233dd0-1012-412d-965e-9c8c46c7dfc4";
          html +=
            `
                  <div style="height: 100%;width:100%;background-image:url(` +
            link +
            `);background-size: 100%;background-repeat:no-repeat;border-width:1px;border-color:#000">
                  `;
          html += `
                  <div class="middleNode end">
                  </div>
                  `;
          if (tree.val != null) {
            if (tree.type == "activity") {
              html +=
                `
                          <div class="topNode">
                          ` +
                tree.val +
                `
                          </div>
                          `;
            } else if (tree.type == "judge") {
              html += `
                          <div class="topNode judge">
                          </div>
                          `;
            }
          } else {
            html += `
                      <div class="start">
                      </div>
                      `;
          }
          html += `          </div>`;
          space.innerHTML = html;
          previousVal = null;
          previousType = null;
          drawFlag = true;
        }, 2000);
      }
    }
  
    function getDirection(val) {
      if (val.state == "Driver Memory") {
        if (selectedDriverName == val.leftCondition) {
          isPersonal = true;
          return "left";
        } else if (selectedDriverName == val.middleCondition) {
          isPersonal = true;
          return "middle";
        }
        isPersonal = false;
        return "right";
      } else if (val.state == "temp < 9") {
        if (OutsideTemperature < 9) {
          return "left";
        } else {
          return "middle";
        }
      } else if (val.state == "temp > 25") {
        if (OutsideTemperature > 25) {
          return "left";
        } else {
          return "middle";
        }
      }
      return null;
    }
  
    widgets.register("FlowChart", (box) => {
      box.injectNode(flowChartModule);
    });
  
    // widget for externalSetting
    const bigBoxModule = document.createElement("div");
    bigBoxModule.setAttribute("style", `height: 100%; width: 100%;`);
    bigBoxModule.innerHTML =
      `
          <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
               <style>
                  .driver-name{
                      font-size:1.5vw;
                  }
                  .driver-description{
                      font-size:1.5vw;
                  }
                  .driver-card-h5{
                      font-size:2vw;
                  }
                  .list-group-item:hover{
                      cursor:pointer;
                  }
                  input[type="range"] {
  
                  -webkit-box-shadow: 0 0.5px 0 0px #424242, 0 1px 0 #060607 inset, 0px 2px 10px 0px black inset, 1px 0px 2px rgba(0, 0, 0, 0.4) inset, 0 0px 1px rgba(0, 0, 0, 0.6) inset;
  
                  margin-top: 0px;
  
                  background-color:#8A8A8A;
  
                  border-radius: 5px;
  
               
                  -webkit-appearance: none;
  
                  height:1.2vw;
  
              }
              input[type=range]::-webkit-slider-runnable-track {
                height: 1vw;
  
              }
            
           
    
              input[type="range"]::-webkit-slider-thumb {
  
                  -webkit-appearance: none;
  
                  cursor: default;
  
  
                  height: 1.3vw;
  
                  width: 1.3vw;
  
                  transform: translateY(2px);
  
                  background: none repeat scroll 0 0 #777;
  
                  border-radius: 1.3vw;
  
                  -webkit-box-shadow: 0 -1px 1px black inset;
  
              }
              .bottomIconLine1 {
              
  
                position:absolute;
                left:21%;
                top:25vw;
                background-color:transparent;
                display:block;
              }
  
              .bottomIconLine2 {
              
                position:absolute;
                left: 36%;
                top:36vw;
                background-color:transparent;
                display:block;
              }
              
              .bottomLight {
                height:0px;
                width:64.7%;
                  position:absolute;
                  left: calc(50% - 32.35%);
                  top:calc(43.4vw);
                  background-color: transparent;
                  display:block;
            
                  
              }
              .upperImg{
               
                z-index:2;
              }
  
              .topLineLeft{
                width:20%;
                position:absolute;
                left:37%;
                top:15vw;
                background-color:transparent;
                display:block;
              }
  
              .topLineRight{
                width:20%;
                position:absolute;
                left:60%;
                top:15vw;
                background-color:transparent;
                display:block;
              }
  
  
              .topLineTop{
                width:20%;
                position:absolute;
                left:60%;
                top:10vw;
                background-color:transparent;
                display:block;
              }
              
              .topLineBottom{
                width:20%;
                position:absolute;
                left:33%;
                top:18vw;
                background-color:transparent;
                display:block;
              }
  
  
              .bottomLeftCorner{
                position:absolute;
                left:20%;
                top:36vw;
                background-color:transparent;
                display:block;
                
              }
  
              .bottomRightCorner1{
                position:absolute;
                left:68%;
                top:36vw;
                background-color:transparent;
                display:block;
              }
  
              .bottomRightCorner2{
                position:absolute;
                left:76%;
                top:36vw;
                background-color:transparent;
                display:block;
              }
  
              #albumImage:hover{
                cursor:pointer;
              }
              
              </style>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
          </head>
  
          <body>
              <div>
                  
  
                  <div style="width:100%;height:47vw;">   
                 
                    <div class="toast-container position-fixed" style="width:40vw;margin-left:30vw;margin-top:20%;">
                      <div id="liveToast" class="toast show fade" role="alert" aria-live="assertive" aria-atomic="true">
                        <div class="toast-header">
                          <strong class="me-auto" style="font-size:2vw;">Tips!</strong>
                          <small>now</small>
                          <button type="button" id="closeAlert" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                        <div class="toast-body" style="font-size:2vw;">
                          Please select a driver first and then click "Run" on your right.
                        </div>
                      </div>
                    </div>
                  
                    <div id="displayVideo" style="width:100%;display:block;"> 
                      <img id="coverImg" src="https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fcover.png?alt=media&token=acbb8797-01db-43b2-a153-082c9e386cf4" style="width:100%;height:47vw;position:absolute;top:0;left:0;z-index:1;">
                      <video class="bigBoxVideo" id="womanWalk" preload playsinline muted src='https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FWoman2Fast.MP4?alt=media&token=9b9dff78-cb86-4fd9-b14d-b8a8903369eb' style = "display:none;height:100%;width:100%;object-fit:contain;">
                      </video>
                      <video class="bigBoxVideo" id="manWalk" preload playsinline muted src='https://media.digitalauto.tech/data/user_files/e25cc63a-2373-483b-b7b3-b20d22a640d0/0c4e93f7-fb99-4005-a3eb-61b2b3622a7fManFast.MP4' style = "display:none;height:100%;width:100%;object-fit:contain;">
                      </video>
                      <video class="bigBoxVideo" id="doorOpen" preload playsinline muted src='https://media.digitalauto.tech/data/user_files/2122e210-3e1c-43da-ac4e-424b6e7d8c90/6755e7a3-bc42-4b11-8925-df36c30d8678openDoor.mp4' style = "display:none;height:100%;width:100%;object-fit:contain;">
                      </video>
                      <video class="bigBoxVideo" id="seatAdjustForward" preload playsinline muted src='https://media.digitalauto.tech/data/user_files/2122e210-3e1c-43da-ac4e-424b6e7d8c90/b7ae8b3e-4a94-4af9-af5d-eac8e945f16bforward.mp4' style = "display:none;height:100%;width:100%;object-fit:contain;">
                      </video>
                      <video class="bigBoxVideo" id="seatAdjustBackward" preload playsinline muted src='https://media.digitalauto.tech/data/user_files/2122e210-3e1c-43da-ac4e-424b6e7d8c90/8f148609-0a59-421e-8997-99476ddf87bfbackward.mp4' style = "display:none;height:100%;width:100%;object-fit:contain;">
                      </video>
                      
                    </div>
                    <div id="displayCockpit" style="width:100%;height:100%;display:none;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Forigin.jpg?alt=media&token=8a37bd7c-c6ed-4172-9180-3773e84ad6dd);background-repeat:no-repeat;background-size:100%;">
                      <img src="https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvehicleWithoutUnit.png?alt=media&token=0d9f7ade-6d48-4a45-ba0f-aded7a5613d2" style="width:100%;position:absolute;top:0;left:0;z-index:1;">
                      
                      <div class= "bottomLight" id="bottomLightDiv">
                      </div>
  
                      <div class="upperImg topLineLeft" id="topLineLeft">
                        <div class="upperImg textToClear" id="driveModeSpan" style="display:inline-block;color:white;font-size:2vw;">
  
                        </div>
  
                      </div>
  
                      <div class="upperImg topLineRight" id="topLineRight">
                        <div class="upperImg imgToHide" id="autoHoldImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FAutoHold.png?alt=media&token=836acc23-6031-4511-98bd-f535f03cfa4b);">
                        </div>
                      </div>
  
                      <div class="upperImg topLineTop" id="topLineTop">
                        <div class="upperImg imgToHide" id="OnePuddleDriveImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FOnePuddle.png?alt=media&token=c1e7b46f-4883-4e60-be32-d36cf114f36e);">
                        </div>
                      </div>
  
                      <div class="upperImg topLineBottom" id="topLineBottom">
                        <div class="upperImg textToClear" id="unitSpan" style="display:inline-block;font-weight:bold;color:white;font-size:1.3vw;">
  
                        </div>
  
                      </div>
  
  
           
  
                      <div class="upperImg bottomIconLine2" id="bottomIconLine2Div">
  
                          <div class="upperImg imgToHide" id="welcomeWord" style="display:inline-block;">
  
                          </div>
                        
                          
                          <div class="upperImg imgToHide" id="powerImage" style="display:none;width:7vh;height:7vh;background-size:7vh 7vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fpower.png?alt=media&token=71d28680-67c3-480d-8576-38081e688b03);">
  
                          </div>
  
                          
                          <div class="upperImg imgToHide" id="steeringImage" style="display:none;width:7vh;height:7vh;background-size:7vh 7vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FESP.png?alt=media&token=34c1f5fb-9132-46e7-abb7-3898f507b923);">
  
                          </div>
                          
  
                          
                          
                     
                          <div class="upperImg imgToHide" id="ACImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fac.png?alt=media&token=473ae149-5a0b-486a-a5a2-21244dfe4e8a)">
  
                          </div>
                          
                          <span class="textToClear" id="AC-temperature" style="font-size:5vh;color:white;">
                          </span>
                          <span class="textToClear" id="AC-temperature-unit" style="font-size:5vh;color:white;">
                            
                          </span>
                          <div class="upperImg ACAirFlowLevelImage imgToHide"  style="display:none;width:3vh;height:3vh;background-size:3vh 3vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Ffan-white.png?alt=media&token=7a7598d4-7e1e-4ce4-a584-e331e6e0511c);">
                          </div>
                          <div class="upperImg ACAirFlowLevelImage imgToHide"  style="display:none;width:3vh;height:3vh;background-size:3vh 3vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Ffan-white.png?alt=media&token=7a7598d4-7e1e-4ce4-a584-e331e6e0511c);">
                          </div>
                          <div class="upperImg ACAirFlowLevelImage imgToHide"  style="display:none;width:3vh;height:3vh;background-size:3vh 3vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Ffan-white.png?alt=media&token=7a7598d4-7e1e-4ce4-a584-e331e6e0511c);">
                          </div>
                          <div class="upperImg ACAirFlowLevelImage imgToHide"  style="display:none;width:3vh;height:3vh;background-size:3vh 3vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Ffan-white.png?alt=media&token=7a7598d4-7e1e-4ce4-a584-e331e6e0511c);">
                          </div>
                          <div class="upperImg ACAirFlowLevelImage imgToHide"  style="display:none;width:3vh;height:3vh;background-size:3vh 3vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Ffan-white.png?alt=media&token=7a7598d4-7e1e-4ce4-a584-e331e6e0511c);">
                          </div>
  
  
  
                          
  
                      </div>
  
                      <div class="upperImg bottomIconLine1 imgToHide" style="display:none;width:23%;background-color:#DEDEDE;border-radius:4vw;height:8vw;box-shadow:0px 0px 1vw 0px #FFFFFF;" id="bottomIconLine1Div">
                        
                        <div style="width:8vw;display:inline-block;">
                          <div class="upperImg" id="albumImage" style="width:8vw;height:8vw;border-radius:4vw;border:solid 1px white;background-size:8vw 8vw;">
                            <img id="pauseImage" src="https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fpause.png?alt=media&token=5b1f1b33-f1bb-46e3-94a6-ae63be93d594" style="z-index:2;width:3vw;height:3vw;position:absolute;top:2.5vw;left:2.5vw;" >
                            <img id="playImage" src="https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fplay.png?alt=media&token=2f4e9032-22bf-41f8-8924-a4bc1e53d367" style="z-index:2;width:3vw;height:3vw;position:absolute;top:2.5vw;left:2.5vw;display:none;" >
                          </div>
                        </div>
  
                          
                        <div style="height:8vw;padding-left:1vw;display:inline-block;">
                          <div style="height:8vw;">
                            <span id="musicName" style="font-size:1.6vw;font-weight:bold;">
                              
                            </span>
                            </br>
                            <span id="musicAuthor" style="font-size:1.3vw;">
                            
                            </span>
                            </br>
                            </br>
                          </div>
                         
                        </div>
                          
  
                          
                        <div id="audioDiv" style="display:none;">
                        </div>
                        <audio src="" id="musicPanel" style="display:none;" controls>
                        </audio>
  
                        
                        
                      </div>
  
                      <div class="upperImg bottomLeftCorner">
                        <div class="upperImg imgToHide" id="SeatHeatImage" style="display:none;width:7vh;height:7vh;background-size:7vh 7vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fseat_heat.png?alt=media&token=8ce653bc-23d9-4840-8bd6-f785de555dac);">
  
                        </div>
                        <div class="upperImg imgToHide" id="SeatVentilationImage" style="display:none;width:6vh;height:6vh;background-size:6vh 6vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fseat-ventilation2.png?alt=media&token=09ffcaeb-9a87-42be-8306-fa5d955d8acc);">
  
                        </div>
                        <div class="upperImg imgToHide" id="steeringWheelWarmImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;margin-bottom:1vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2Fsteer-wheel-heat.png?alt=media&token=a32fd432-7fa0-4e3a-a170-f74fbb82bab1);">
                        </div>
                      </div>
  
                      <div class="upperImg bottomRightCorner1">
                        <div class="upperImg imgToHide" id="volumeDisableParkingImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeDisable.png?alt=media&token=0c4a4203-b04a-499f-a9c7-5515af6996d4);margin-left:1vw;">
  
                        </div>
                        <div class="upperImg imgToHide" id="volumeLowParkingImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeLow.png?alt=media&token=b806a797-3911-49a2-abc4-fc288a8f7499);margin-left:1vw;">
  
                        </div>
  
                        <div class="upperImg imgToHide" id="volumeMediumParkingImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeMiddle.png?alt=media&token=27d4448a-b39a-480c-a5df-e5a0dea16155);margin-left:1vw;">
                        </div>
  
                        <div class="upperImg imgToHide" id="volumeHighParkingImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeHigh.png?alt=media&token=4ac0114a-ce0c-4cbb-8acd-58dfd97504af);margin-left:1vw;">
                        </div>
                        </br>
                        <span class="upperImg textToClear" id="ParkingBeepSpan" style="color:white;font-size:1.5vh;">
                        
                        </span>
                      </div>
  
  
                      <div class="upperImg bottomRightCorner2">
                        <div class="upperImg imgToHide" id="volumeDisableImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeDisable.png?alt=media&token=0c4a4203-b04a-499f-a9c7-5515af6996d4);margin-left:1vw;">
  
                        </div>
                        <div class="upperImg imgToHide" id="volumeLowImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeLow.png?alt=media&token=b806a797-3911-49a2-abc4-fc288a8f7499);margin-left:1vw;">
  
                        </div>
  
                        <div class="upperImg imgToHide" id="volumeMediumImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeMiddle.png?alt=media&token=27d4448a-b39a-480c-a5df-e5a0dea16155);margin-left:1vw;">
                        </div>
  
                        <div class="upperImg imgToHide" id="volumeHighImage" style="display:none;width:5vh;height:5vh;background-size:5vh 5vh;;background-image:url(https://firebasestorage.googleapis.com/v0/b/digital-auto.appspot.com/o/media%2FvolumeHigh.png?alt=media&token=4ac0114a-ce0c-4cbb-8acd-58dfd97504af);margin-left:1vw;">
                        </div>
                        </br>
                        <span class="upperImg textToClear" id="ADASBeepSpan" style="color:white;font-size:1.5vh;">
                        
                        </span>
                      </div>
                      
  
                    </div>
  
                  </div>
                  <div class="row" style="width:100%;height:calc(100% - 47vw);margin-top:0%;">
                      <div class="col" style="padding-left:0px;padding-right:0px;">
                          <div class="card" style="margin-left:15px;margin-top:5px;font-size:1.5vw;">
                              <h5 class="card-header" style="font-size:2vw;">
                                External Setting
                              </h5>
  
      
  
                              <div class="row" style="margin-top:0.5vw;">
                                  <label class="col-sm-5 col-form-label col-form-label" style="text-align:center;">Outside Temperature</label>
                                  <div class="col-sm-6" style="background-color:#FFBE7D;border-radius:5px;">
                                      <label for="temperatureRange" class="form-label" style="margin-bottom:0px;">
                                        <span id="temperatureRangeLabel">-50°C ~ +50°C</span>
                                      </label>
                                      </br>
                                      Current:<span id="temperatureRangeDisplay" style="text-decoration:underline;">
                                          50
                                      </span>
                                      <span class="temperatureUnit">
                                        °C
                                      </span>
                                </br>
                                      <input type="range" class="form-range" min="-50" max="50" id="temperatureRange">
                
                                    </div>
                              </div>
  
                     
                              <div class="row"  style="margin-top:0.5vw;">
                                  <label class="col-sm-5 col-form-label col-form-label" style="text-align:center;">Rain Intensity</label>
                                  <div class="col-sm-6" style="background-color:#CAECF4;border-radius:5px;">
                                      <label for="rainRange" class="form-label" style="margin-bottom:0px;">0% ~ 100%</label>
                                      </br>
                                      Current:<span id="rainRangeDisplay" style="text-decoration:underline;">
                                          50
                                      </span>%
                                      </br>
                                      <input type="range" class="form-range" min="0" max="100" id="rainRange">
                             
                                    </div>
                              </div>
                     
                              
                              
                    
  
                          </div>
                      </div>
                      
  
                      <div class="col" style="padding-left:10px;padding-right:10px;height:100%;overflow-y:auto;">
                      <div class="card" style="margin-left:0px;margin-top:5px;">
                      <table class = "table setting-table" style="font-size:1.5vw;">
                      <tbody>
                          <tr>
            
                              <td>
                                  <div class="row g-3 align-items-center">
                                      <div class="col-8">
                                          <span class="float-start" style="margin-left:8px">
                                              Seat Position:&nbsp;
                                          </span>
                                          <span id="seatPositionRangeDisplay" style="text-decoration:underline;">
                                              ` +
      systemDictionary["seatPosition"].val +
      `
                                          </span> mm
                                      </div>
                                      <div class="col-4">
                                          <input type="range" class="form-range float-end driver-input-child" min="0" max="500" id="SeatPositionRange" value="` +
      systemDictionary["seatPosition"].val +
      `">
                                      </div>
                                      
                                  </div>
                                    
                              </td>
                          </tr>
                          <tr>
                
                           <td>
                            <div class="row g-3 align-items-center">
                            <div class="col-7">
                                   <span class="float-start" style="margin-left:8px">
                                       Drive Mode
                                       </span>
                               </div>
                              <div class="col-5">
                                        <select class="form-select form-select-sm float-end setting-checkbox-child driver-input-child" id="DriveModeSelect" style="font-size:1.5vw;background-size:1.5vw;padding:.375rem 1rem .375rem .75rem;background-position:right 0.25rem center;">
                                          <option id="OptionECO" value="ECO">ECO</option>    
                                          <option id="OptionSPO" value="SPO">SPO</option>
                                          <option id="OptionCOM" value="COM">COM</option>
                                          
                                        </select>
                                       </div>
                                  </div>
                           </td>
                       </tr>
  
                       
                          <tr>
                    
                              <td>
                                      <div class="row g-3 align-items-center">
                                          <div class="col-8">
                                              <span class="float-start" style="margin-left:8px">
                                                  AC temperature if cold:&nbsp;
                                              </span>
                                              <span id="ACTemperatureIfColdRangeDisplay" style="text-decoration:underline;" class="temperatureValue">
                                                  ` +
      systemDictionary.ACTemperatureIfCold.val +
      `
                                              </span>
                                              <span class="temperatureUnit">
                                                °C
                                              </span>
                                          </div>
                                          <div class="col-4">
                                              <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.ACTemperatureIfCold.val +
      `" id="ACTemperatureIfColdRange">
                                          </div>
                                      </div>
                              </td>
                          </tr>
                          <tr>
                    
                              <td>
                                      <div class="row g-3 align-items-center">
                                          <div class="col-8">
                                              <span class="float-start" style="margin-left:8px">
                                                  AC temperature if hot:&nbsp;
                                              </span>
                                              <span id="ACTemperatureIfHotRangeDisplay" style="text-decoration:underline;"  class="temperatureValue">
                                                  ` +
      systemDictionary.ACTemperatureIfHot.val +
      `
                                              </span>
                                              <span class="temperatureUnit">
                                                °C
                                              </span>
                                          </div>
                                          <div class="col-4">
                                              <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.ACTemperatureIfHot.val +
      `" id="ACTemperatureIfHotRange">
                                          </div>
                                      </div>
                              </td>
                          </tr>
                          <tr>
                   
                              <td>
      
                                  <div class="row g-3 align-items-center">
                                      <div class="col-8">
                                          <span class="float-start" style="margin-left:8px">
                                              AC Air Flow Level:&nbsp;
                                          </span>
                                          <span id="ACAirFlowLevelRangeDisplay" style="text-decoration:underline;">
                                              ` +
      systemDictionary.ACAirFlowLevel.val +
      `
                                          </span>
                                      </div>
                                      <div class="col-4">
                                          <input type="range" class="form-range driver-input-child float-end" min="0" max="5" step="1" value="` +
      systemDictionary.ACAirFlowLevel.val +
      `" id="ACAirFlowLevelRange">
                                      </div>
                                  </div>
                                     
                              </td>
                          </tr>
                          <tr>
                   
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-8">
                                      <span class="float-start" style="margin-left:8px">
                                          Steering Wheel Warm:&nbsp;
                                      </span>
                                      <span id="SteeringWheelWarmRangeDisplay" style="text-decoration:underline;">
                                        ` +
      systemDictionary.SteeringWheelWarm.val +
      `
                                      </span>
                                  </div>
                                  <div class="col-4">
                                      <input type="range" class="form-range driver-input-child float-end" min="0" max="3" step="1" value="` +
      systemDictionary.SteeringWheelWarm.val +
      `" id="SteeringWheelWarmRange">
                                  </div>
                              </div>
                              
                          </td>
                           </tr>
                           <tr>
                   
                          <td>
                                  <div class="row g-3 align-items-center">
                                      <div class="col-8">
                                          <span class="float-start" style="margin-left:8px">
                                              Seat Heat Level:&nbsp;
                                          </span>
                                          <span id="SeatHeatLevelRangeDisplay" style="text-decoration:underline;">
                                              ` +
      systemDictionary.SeatHeatLevel.val +
      `
                                          </span>
                                      </div>
                                      <div class="col-4">
                                          <input type="range" class="form-range driver-input-child float-end" min="0" max="3" step="1" value="` +
      systemDictionary.SeatHeatLevel.val +
      `" id="SeatHeatLevelRange">
                                      </div>
                                  </div>
                          </td>
                           </tr>
                           <tr>
                   
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-8">
                                      <span class="float-start" style="margin-left:8px">
                                          Seat Ventilation:&nbsp;
                                      </span>
                                      <span id="SeatVentilationRangeDisplay" style="text-decoration:underline;">
                                      ` +
      systemDictionary.SeatVentilation.val +
      `
                                      </span>
                                  </div>
                                  <div class="col-4">
                                      <input type="range" class="form-range driver-input-child float-end" min="0" max="3" step="1"  value="` +
      systemDictionary.SeatVentilation.val +
      `" id="SeatVentilationRange">
                                  </div>
                              </div>
                          </td>
                           </tr>
                           <tr>
            
                           <td>
                                   <span class="float-start" style="margin-left:8px">
                                       AutoHold
                                   </span>
                                   <div class="form-switch clearfix">
                                       <input class="form-check-input driver-input-child float-end " type="checkbox" role="switch" id="AutoHoldControl">
                                   </div>
                           </td>
                       </tr>
                       <tr>
                 
                           <td>
                                  <div class="row g-3 align-items-center">
                                    <div class="col-8">
                                        <span class="float-start" style="margin-left:8px">
                                          mirrorLeftTilt:&nbsp;
                                        </span>
                                        <span id="mirrorLeftTiltRangeDisplay" style="text-decoration:underline;">
                                            ` +
      systemDictionary.mirrorLeftTilt.val +
      `
                                        </span>
                                    </div>
                                    <div class="col-4">
                                        <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.mirrorLeftTilt.val +
      `" id="mirrorLeftTiltRange">
                                    </div>
                                </div>
                                </td>
                                </tr>
                                <tr>
                        
                               <td>
                                <div class="row g-3 align-items-center">
                                  <div class="col-8">
                                      <span class="float-start" style="margin-left:8px">
                                        mirrorLeftPan:&nbsp;
                                      </span>
                                      <span id="mirrorLeftPanRangeDisplay" style="text-decoration:underline;">
                                      ` +
      systemDictionary.mirrorLeftPan.val +
      `
                                      </span>
                                  </div>
                                  <div class="col-4">
                                      <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.mirrorLeftPan.val +
      `" id="mirrorLeftPanRange">
                                  </div>
                              </div>
                              </td>
                              </tr>
                              <tr>
                      
                             <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-8">
                                      <span class="float-start" style="margin-left:8px">
                                          mirrorRightTilt:&nbsp;
                                      </span>
                                      <span id="mirrorRightTiltRangeDisplay" style="text-decoration:underline;">
                                        ` +
      systemDictionary.mirrorRightTilt.val +
      `
                                      </span>
                                  </div>
                                  <div class="col-4">
                                      <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.mirrorRightTilt.val +
      `" id="mirrorRightTiltRange">
                                  </div>
                              </div>
                              </td>
                           </tr>
                           <tr>
                   
                          <td>
                              <div class="row g-3 align-items-center">
                                  <div class="col-8">
                                      <span class="float-start" style="margin-left:8px">
                                      mirrorRightPan:&nbsp;
                                      </span>
                                      <span id="mirrorRightPanRangeDisplay" style="text-decoration:underline;">
                                        ` +
      systemDictionary.mirrorRightPan.val +
      `
                                      </span>
                                  </div>
                                  <div class="col-4">
                                      <input type="range" class="form-range driver-input-child float-end" min="-50" max="50" value="` +
      systemDictionary.mirrorRightPan.val +
      `" id="mirrorRightPanRange">
                                  </div>
                              </div>
                           </td>
                       </tr>
                       
  
  
                      </tbody>
                  </table>
              
                      </div>
                      </div>
  
                      
                      <div class="col" style="padding-left:0px;padding-right:0px;">
                           <div id="pickDriver" class="card" style="margin-top:5px;border:3px solid red;box-shadow:0px 0px 4px 4px red;--bs-card-spacer-y:1vw;">
                              <h5 class="card-header driver-card-h5">Pick a driver</h5>
                              <div class="card-body" style="padding-left:10px;padding-top:7px;">
                                  <div id="multipleUsersDiv"></div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          
              <script src=https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script>
              <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
          </body>   
      `;
  
    // var RainIntensityRange = bigBoxModule.querySelector('#rainRange');
    // RainIntensityRange.addEventListener('click',function(event){})
  
    var musicControl = bigBoxModule.querySelector("#albumImage");
    var playStatus = true;
    musicControl.addEventListener("click", function (event) {
      var audio = bigBoxModule.querySelector("#musicPanel");
      if (playStatus) {
        bigBoxModule.querySelector("#pauseImage").style.display = "none";
        bigBoxModule.querySelector("#playImage").style.display = "inline";
        playStatus = false;
        audio.pause();
      } else {
        bigBoxModule.querySelector("#pauseImage").style.display = "inline";
        bigBoxModule.querySelector("#playImage").style.display = "none";
        playStatus = true;
        audio.play();
      }
    });
  
    var RainIntensityRange2 = bigBoxModule.querySelector("#rainRange");
    RainIntensityRange2.addEventListener("click", function (event) {
      rainIntensity = event.target.value;
      // console.log("rainIntensity:", rainIntensity);
      bigBoxModule.querySelector("#rainRangeDisplay").innerHTML = rainIntensity;
    });
  
    var temperatureRange2 = bigBoxModule.querySelector("#temperatureRange");
    temperatureRange2.addEventListener("click", function (event) {
      OutsideTemperature = event.target.value;
      // console.log("OutsideTemperature:", OutsideTemperature);
      if (systemDictionary.USMetricUnit.val == "US") {
        bigBoxModule.querySelector("#temperatureRangeDisplay").innerHTML =
          toFahrenheit(OutsideTemperature);
      } else if (systemDictionary.USMetricUnit.val == "Metric") {
        bigBoxModule.querySelector("#temperatureRangeDisplay").innerHTML =
          OutsideTemperature;
      }
    });
  
    var SeatPositionRange = bigBoxModule.querySelector("#SeatPositionRange");
    SeatPositionRange.addEventListener("click", function (event) {
      systemDictionary.seatPosition.val = event.target.value;
      // console.log("Seat Position:", systemDictionary.seatPosition.val);
      bigBoxModule.querySelector("#seatPositionRangeDisplay").innerHTML =
        systemDictionary.seatPosition.val;
    });
  
    var ACTemperatureIfHotRange = bigBoxModule.querySelector(
      "#ACTemperatureIfHotRange"
    );
    ACTemperatureIfHotRange.addEventListener("click", function (event) {
      systemDictionary.ACTemperatureIfHot.val = event.target.value;
  
      if (systemDictionary.USMetricUnit.val == "US") {
        bigBoxModule.querySelector("#ACTemperatureIfHotRangeDisplay").innerHTML =
          toFahrenheit(event.target.value);
      } else if (systemDictionary.USMetricUnit.val == "Metric") {
        bigBoxModule.querySelector("#ACTemperatureIfHotRangeDisplay").innerHTML =
          event.target.value;
      }
    });
  
    var ACTemperatureIfColdRange = bigBoxModule.querySelector(
      "#ACTemperatureIfColdRange"
    );
    ACTemperatureIfColdRange.addEventListener("click", function (event) {
      systemDictionary.ACTemperatureIfCold.val = event.target.value;
  
      if (systemDictionary.USMetricUnit.val == "US") {
        bigBoxModule.querySelector("#ACTemperatureIfColdRangeDisplay").innerHTML =
          toFahrenheit(event.target.value);
      } else if (systemDictionary.USMetricUnit.val == "Metric") {
        bigBoxModule.querySelector("#ACTemperatureIfColdRangeDisplay").innerHTML =
          event.target.value;
      }
    });
  
    var ACAirFlowLevelRange = bigBoxModule.querySelector("#ACAirFlowLevelRange");
    ACAirFlowLevelRange.addEventListener("click", function (event) {
      systemDictionary.ACAirFlowLevel.val = event.target.value;
      // console.log("AC Air Flow Level:", systemDictionary.ACAirFlowLevel.val);
      bigBoxModule.querySelector("#ACAirFlowLevelRangeDisplay").innerHTML =
        systemDictionary.ACAirFlowLevel.val;
    });
    var SteeringWheelWarmRange = bigBoxModule.querySelector(
      "#SteeringWheelWarmRange"
    );
    SteeringWheelWarmRange.addEventListener("click", function (event) {
      systemDictionary.SteeringWheelWarm.val = event.target.value;
      // console.log("Steering Wheel Warm:", systemDictionary.SteeringWheelWarm.val);
      bigBoxModule.querySelector("#SteeringWheelWarmRangeDisplay").innerHTML =
        systemDictionary.SteeringWheelWarm.val;
    });
  
    var SeatHeatLevelRange = bigBoxModule.querySelector("#SeatHeatLevelRange");
    SeatHeatLevelRange.addEventListener("click", function (event) {
      systemDictionary.SeatHeatLevel.val = event.target.value;
      // console.log("Seat Heat Level:", systemDictionary.SeatHeatLevel.val);
      bigBoxModule.querySelector("#SeatHeatLevelRangeDisplay").innerHTML =
        systemDictionary.SeatHeatLevel.val;
    });
  
    var SeatVentilationRange = bigBoxModule.querySelector(
      "#SeatVentilationRange"
    );
    SeatVentilationRange.addEventListener("click", function (event) {
      systemDictionary.SeatVentilation.val = event.target.value;
      // console.log("Seat Ventilation:", systemDictionary.SeatVentilation.val);
      bigBoxModule.querySelector("#SeatVentilationRangeDisplay").innerHTML =
        systemDictionary.SeatVentilation.val;
    });
  
    var mirrorLeftTiltRange = bigBoxModule.querySelector("#mirrorLeftTiltRange");
    mirrorLeftTiltRange.addEventListener("click", function (event) {
      systemDictionary.mirrorLeftTilt.val = event.target.value;
      // console.log("mirrorLeftTilt:", systemDictionary.mirrorLeftTilt.val);
      bigBoxModule.querySelector("#mirrorLeftTiltRangeDisplay").innerHTML =
        systemDictionary.mirrorLeftTilt.val;
    });
  
    var mirrorLeftPanRange = bigBoxModule.querySelector("#mirrorLeftPanRange");
    mirrorLeftPanRange.addEventListener("click", function (event) {
      systemDictionary.mirrorLeftPan.val = event.target.value;
      // console.log("mirrorLeftPan:", systemDictionary.mirrorLeftPan.val);
      bigBoxModule.querySelector("#mirrorLeftPanRangeDisplay").innerHTML =
        systemDictionary.mirrorLeftPan.val;
    });
  
    var mirrorRightTiltRange = bigBoxModule.querySelector(
      "#mirrorRightTiltRange"
    );
    mirrorRightTiltRange.addEventListener("click", function (event) {
      systemDictionary.mirrorRightTilt.val = event.target.value;
      // console.log("mirrorRightTilt:", systemDictionary.mirrorRightTilt.val);
      bigBoxModule.querySelector("#mirrorRightTiltRangeDisplay").innerHTML =
        systemDictionary.mirrorRightTilt.val;
    });
  
    var mirrorRightPanRange = bigBoxModule.querySelector("#mirrorRightPanRange");
    mirrorRightPanRange.addEventListener("click", function (event) {
      systemDictionary.mirrorRightPan.val = event.target.value;
      // console.log("mirrorRightPan:", systemDictionary.mirrorRightPan.val);
      bigBoxModule.querySelector("#mirrorRightPanRangeDisplay").innerHTML =
        systemDictionary.mirrorRightPan.val;
    });
  
    var AutoHoldControl = bigBoxModule.querySelector("#AutoHoldControl");
  
    var DriveModeSelect = bigBoxModule.querySelector("#DriveModeSelect");
  
    var closeAlert = bigBoxModule.querySelector("#closeAlert");
    var alertDiv = bigBoxModule.querySelector("#liveToast");
    closeAlert.addEventListener("click", function (event) {
      alertDiv.setAttribute("class", "toast");
    });
  
    AutoHoldControl.addEventListener("click", function (event) {
      AutoHoldIsOn = event.target.checked;
      if (event.target.checked) {
        systemDictionary.AutoHold.val = "On";
      } else {
        systemDictionary.AutoHold.val = "Off";
      }
  
      // console.log("On/Off:", AutoHoldIsOn);
    });
  
    DriveModeSelect.onchange = function () {
      systemDictionary.driveMode.val = this.value;
    };
  
    var personDic = {
      Person2: ["NBAPlayer", "NBA all star"],
      Person3: ["Wife", "NBA Player's wife"],
      Person1: ["Custom", "Customize your own"],
    };
  
    var usrAvatar = personalSettingModule.querySelector("#avatar");
  
    var driverName = personalSettingModule.querySelector("#driver-name-span");
  
    var driverWelcome = personalSettingModule.querySelector("#Welcome");
  
    var html = "";
    html += `<div class="row">
                  <div class="col-6">
                      <div class="list-group driver-name" id="list-tab" role="tablist">`;
    for (var key in personDic) {
      html +=
        '<a class="list-group-item list-group-item-action" style="padding:0.7vw 0px 0.7vw 1.5vw;" id="' +
        key +
        '" data-bs-toggle="list" role="tab" aria-controls="' +
        personDic[key][1] +
        'Content">' +
        personDic[key][0] +
        "</a>";
    }
    html += `
          </div>
                  </div>
              <div class="col-6">
                  <div class="tab-content driver-description" id="nav-tabContent">
      `;
    for (var key in personDic) {
      html +=
        '<div class="tab-pane fade " id="' +
        key +
        'Content" role="tabpanel" aria-labelledby="' +
        key +
        '">' +
        personDic[key][1] +
        "</div>";
    }
    html += `
      </div>
              </div>
            </div>
      `;
    bigBoxModule.querySelector("#multipleUsersDiv").innerHTML = html;
  
    var previousTab = null;
    var previousContent = null;
    for (var key in personDic) {
      bigBoxModule
        .querySelector("#" + key)
        .addEventListener("click", function (event) {
          selectedDriverName = personDic[this.id][0];
          // console.log(this.id);
          bigBoxModule.querySelector("#pickDriver").style.border =
            "1px solid #CCCCCC";
          bigBoxModule.querySelector("#pickDriver").style.boxShadow =
            "0px 0px 0px 0px";
          alertDiv.setAttribute("class", "toast");
          switchSystemDictionary(personDic[this.id][0]);
          if (previousTab != null) {
            previousTab.setAttribute(
              "class",
              "list-group-item list-group-item-action"
            );
            previousContent.setAttribute("class", "tab-pane fade");
          }
          previousTab = bigBoxModule.querySelector("#" + this.id);
          previousContent = bigBoxModule.querySelector("#" + this.id + "Content");
          previousTab.setAttribute(
            "class",
            "list-group-item list-group-item-action active"
          );
          previousContent.setAttribute("class", "tab-pane fade show active");
          driverName.innerHTML = personDic[this.id][0];
          driverWelcome.innerHTML = personDic[this.id][1];
  
          let inputList = personalSettingModule.querySelectorAll(
            ".driver-input-child"
          );
          let inputList2 = bigBoxModule.querySelectorAll(".driver-input-child");
          if (personDic[this.id][0] == "Custom") {
            for (let item of inputList) {
              if (item.getAttribute("disabled")) {
                item.removeAttribute("disabled");
              }
            }
            for (let item of inputList2) {
              if (item.getAttribute("disabled")) {
                item.removeAttribute("disabled");
              }
            }
          } else {
            for (let item of inputList) {
              item.setAttribute("disabled", "disabled");
            }
            for (let item of inputList2) {
              item.setAttribute("disabled", "disabled");
            }
          }
  
          updateWebpage(personDic[this.id][0]);
          previousSelectedDriverName = selectedDriverName;
        });
    }
  
    var dividing = false;
    function nextStep() {
      if (!dividing) {
        if (curTree.type == "activity") {
          drawTree(curTree);
          curTree = curTree.middle;
        } else if (curTree.type == "judge") {
          moveDirection = getDirection(curTree.val);
          dividing = true;
          drawTree(curTree);
        }
      } else {
        dividing = false;
        if (moveDirection == "left") {
          curTree = curTree.left;
          drawTree(curTree);
        } else if (moveDirection == "middle") {
          curTree = curTree.middle;
          drawTree(curTree);
        } else if (moveDirection == "right") {
          curTree = curTree.right;
          drawTree(curTree);
        }
  
        if (curTree.type == "judge") {
          moveDirection = getDirection(curTree.val);
          dividing = true;
          // console.log(moveDirection);
        } else {
          curTree = curTree.middle;
        }
      }
    }
    var videoDiv = bigBoxModule.querySelector("#displayVideo");
    var cockpitDiv = bigBoxModule.querySelector("#displayCockpit");
  
    var did = setInterval(catchDoorSignal, 500);
    async function catchDoorSignal() {
      // // console.log("catch door signal")
      var doorSignal = await vehicle["Cabin.Door.Row1.Left.IsOpen"].get();
      if (doorSignal == true) {
        // console.log("door true");
        playVideo(
          "doorOpen",
          ""
        );
  
        clearInterval(did);
      }
    }
  
    var sid = setInterval(catchSeatSignal, 500);
  
    async function catchSeatSignal() {
      // // console.log("catch seat signal")
      var seatSignal = await vehicle["Cabin.Seat.Row1.Pos1.Height"].get();
      if (seatSignal == "100" || seatSignal == 100) {
        // console.log("seat true");
        if(selectedDriverName == "Wife"){
          playVideo(
            "seatAdjustForward",
            ""
          );
        }else{
          if(selectedDriverName == "Custom"){
            if(systemDictionary.seatPosition.val <= 250){
              playVideo(
                "seatAdjustBackWard",
                ""
              );
            }else{
              playVideo(
                "seatAdjustForward",
                ""
              );
            }
          }else{
            playVideo(
              "seatAdjustBackWard",
              ""
            );
          }
          
        }
        
  
        clearInterval(sid);
      }
    }
  
    function displayVideo() {
      cockpitDiv.style.display = "none";
      videoDiv.style.display = "block";
    }
  
    function displayCockpit() {
      cockpitDiv.style.display = "block";
      videoDiv.style.display = "none";
    }
    function playVideo(target, url) {
      // console.log("play");
      
  
      let targetVideo = bigBoxModule.querySelector("#" + target);
      targetVideo.play();
    
      let videoList = bigBoxModule.querySelectorAll(".bigBoxVideo");
      for (let videoItem of videoList) {
  
        videoItem.style.display = "none";
      }
      targetVideo.style.display = "block";
      bigBoxModule.querySelector("#coverImg").style.display ="none";
      displayVideo();
      
      // videoDiv.innerHTML =
      //   `
      //     <video id='` +
      //   target +
      //   `'
      //     playsinline autoplay muted
      //     src='` +
      //   url +
      //   `'
      //     style="display:block;height: 100%; width: 100%; object-fit: contain;"
      //     ></video>
  
    }
  
    // clearInterval(catchSignal)
  
    function updateWebpage(pickedDriverName) {
      if (
        pickedDriverName == "NBAPlayer" ||
        pickedDriverName == "Wife"
      ) {
        updateWebpageContent(allDriverDictionary[pickedDriverName]);
      } else {
        updateWebpageContent(customizedDictionary);
      }
    }
  
    function updateWebpageContent(dictionary) {
      // console.log("update webpage");
      // console.log(dictionary["seatPosition"].val);
      changeTemperatureUnit(dictionary["USMetricUnit"].val);
      personalSettingModule.querySelector(
        "#" + dictionary["language"].val
      ).selected = true;
  
      personalSettingModule.querySelector(
        "#" + dictionary["USMetricUnit"].val
      ).selected = true;
  
      personalSettingModule.querySelector(
        "#optionParking" + dictionary["parkingBeepLevel"].val
      ).selected = true;
  
      personalSettingModule.querySelector(
        "#optionADAS" + dictionary["ADASBeepLevel"].val
      ).selected = true;
  
      personalSettingModule.querySelector(
        "#option" + dictionary["musicURI"].val
      ).selected = true;
  
      personalSettingModule.querySelector("#InteriorLightColor").value =
        "#" + dictionary["InteriorLight"].val;
  
      personalSettingModule.querySelector("#SeatPositionCheck").checked =
        dictionary["seatPosition"].onOff;
  
      personalSettingModule.querySelector("#ACTemperatureCheck").checked =
        dictionary["ACTemperatureIfCold"].onOff;
  
      personalSettingModule.querySelector("#ACAirFlowLevelCheck").checked =
        dictionary["ACAirFlowLevel"].onOff;
  
      personalSettingModule.querySelector("#SteeringWheelWarmCheck").checked =
        dictionary["SteeringWheelWarm"].onOff;
  
      personalSettingModule.querySelector("#SeatHeatLevelCheck").checked =
        dictionary["SeatHeatLevel"].onOff;
  
      personalSettingModule.querySelector("#SeatVentilationCheck").checked =
        dictionary["SeatVentilation"].onOff;
  
      personalSettingModule.querySelector("#AutoHoldCheck").checked =
        dictionary["AutoHold"].onOff;
  
      personalSettingModule.querySelector("#MirrorStatusCheck").checked =
        dictionary["mirrorLeftTilt"].onOff;
  
      personalSettingModule.querySelector("#DriveModeCheck").checked =
        dictionary["driveMode"].onOff;
  
      personalSettingModule.querySelector("#OnePuddleCheck").checked =
        dictionary["OnePuddle"].onOff;
  
      bigBoxModule.querySelector("#seatPositionRangeDisplay").innerHTML =
        dictionary["seatPosition"].val;
      bigBoxModule.querySelector("#SeatPositionRange").value =
        dictionary["seatPosition"].val;
  
      bigBoxModule.querySelector("#ACTemperatureIfColdRange").value =
        dictionary["ACTemperatureIfCold"].val;
  
      bigBoxModule.querySelector("#ACTemperatureIfHotRange").value =
        dictionary["ACTemperatureIfHot"].val;
  
      if (dictionary["USMetricUnit"].val == "US") {
        bigBoxModule.querySelector("#ACTemperatureIfColdRangeDisplay").innerHTML =
          toFahrenheit(dictionary["ACTemperatureIfCold"].val);
  
        bigBoxModule.querySelector("#ACTemperatureIfHotRangeDisplay").innerHTML =
          toFahrenheit(dictionary["ACTemperatureIfHot"].val);
      } else if (dictionary["USMetricUnit"].val == "Metric") {
        bigBoxModule.querySelector("#ACTemperatureIfColdRangeDisplay").innerHTML =
          dictionary["ACTemperatureIfCold"].val;
  
        bigBoxModule.querySelector("#ACTemperatureIfHotRangeDisplay").innerHTML =
          dictionary["ACTemperatureIfHot"].val;
      }
      bigBoxModule.querySelector("#ACAirFlowLevelRangeDisplay").innerHTML =
        dictionary["ACAirFlowLevel"].val;
      bigBoxModule.querySelector("#ACAirFlowLevelRange").value =
        dictionary["ACAirFlowLevel"].val;
  
      bigBoxModule.querySelector("#SteeringWheelWarmRangeDisplay").innerHTML =
        dictionary["SteeringWheelWarm"].val;
      bigBoxModule.querySelector("#SteeringWheelWarmRange").value =
        dictionary["SteeringWheelWarm"].val;
  
      bigBoxModule.querySelector("#SeatHeatLevelRangeDisplay").innerHTML =
        dictionary["SeatHeatLevel"].val;
      bigBoxModule.querySelector("#SeatHeatLevelRange").value =
        dictionary["SeatHeatLevel"].val;
  
      bigBoxModule.querySelector("#SeatVentilationRangeDisplay").innerHTML =
        dictionary["SeatVentilation"].val;
      bigBoxModule.querySelector("#SeatVentilationRange").value =
        dictionary["SeatVentilation"].val;
  
      // autohold
      if (dictionary["AutoHold"].val == "On") {
        bigBoxModule.querySelector("#AutoHoldControl").checked = true;
      } else {
        bigBoxModule.querySelector("#AutoHoldControl").checked = false;
      }
  
      bigBoxModule.querySelector("#mirrorLeftTiltRangeDisplay").innerHTML =
        dictionary["mirrorLeftTilt"].val;
      bigBoxModule.querySelector("#mirrorLeftTiltRange").value =
        dictionary["mirrorLeftTilt"].val;
  
      bigBoxModule.querySelector("#mirrorLeftPanRangeDisplay").innerHTML =
        dictionary["mirrorLeftPan"].val;
      bigBoxModule.querySelector("#mirrorLeftPanRange").value =
        dictionary["mirrorLeftPan"].val;
  
      bigBoxModule.querySelector("#mirrorRightTiltRangeDisplay").innerHTML =
        dictionary["mirrorRightTilt"].val;
      bigBoxModule.querySelector("#mirrorRightTiltRange").value =
        dictionary["mirrorRightTilt"].val;
  
      bigBoxModule.querySelector("#mirrorRightPanRangeDisplay").innerHTML =
        dictionary["mirrorRightPan"].val;
      bigBoxModule.querySelector("#mirrorRightPanRange").value =
        dictionary["mirrorRightPan"].val;
  
      bigBoxModule.querySelector(
        "#Option" + dictionary["driveMode"].val
      ).selected = true;
  
      switchLanguage(dictionary["language"].val);
      // drive mode
    }
  
    function switchLanguage(targetLanguage) {
      for (var key in languageDictionary) {
        // // console.log(personalSettingModule.querySelector("#"+key));
        personalSettingModule.querySelector("#" + key).innerHTML =
          languageDictionary[key][targetLanguage];
      }
    }
  
    function switchSystemDictionary(pickedDriverName) {
      if (previousSelectedDriverName == "Custom") {
        // console.log(originalCustomDictionary);
        customizedDictionary = systemDictionary;
        Object.entries(customizedDictionary).forEach(([key, value]) => {
          if (value.onOff == false) {
            customizedDictionary[key].val = originalCustomDictionary[key].val;
          }
        });
        // console.log(originalCustomDictionary);
      }
  
      if (
        pickedDriverName == "NBAPlayer" ||
        pickedDriverName == "Wife"
      ) {
        systemDictionary = allDriverDictionary[pickedDriverName];
      } else {
        systemDictionary = customizedDictionary;
      }
    }
  
    function pasteToNewDictionary(oldDictionary) {
      let newDictionary = {};
      let tempValue = {};
      Object.entries(oldDictionary).forEach(([key, value]) => {
        tempValue = {
          val: value.val,
          onOff: value.onOff,
        };
        newDictionary[key] = tempValue;
        tempValue = {};
      });
  
      return newDictionary;
    }
  
    function changeTemperatureUnit(targetUnit) {
      if (targetUnit == "US") {
        bigBoxModule.querySelector("#temperatureRangeLabel").innerHTML =
          "-58°F ~ +122°F";
        bigBoxModule.querySelector("#temperatureRangeDisplay").innerHTML =
          toFahrenheit(OutsideTemperature);
        for (let item of bigBoxModule.querySelectorAll(".temperatureValue")) {
          let name = item.id.replace("RangeDisplay", "");
          item.innerHTML = toFahrenheit(systemDictionary[name].val);
        }
        for (let item of bigBoxModule.querySelectorAll(".temperatureUnit")) {
          item.innerHTML = "°F";
        }
      } else if (targetUnit == "Metric") {
        bigBoxModule.querySelector("#temperatureRangeLabel").innerHTML =
          "-50°C ~ +50°C";
        bigBoxModule.querySelector("#temperatureRangeDisplay").innerHTML =
          OutsideTemperature;
        for (let item of bigBoxModule.querySelectorAll(".temperatureValue")) {
          let name = item.id.replace("RangeDisplay", "");
          item.innerHTML = systemDictionary[name].val;
        }
        for (let item of bigBoxModule.querySelectorAll(".temperatureUnit")) {
          item.innerHTML = "°C";
        }
      }
    }
  
    function toFahrenheit(value) {
      return Math.floor((parseInt(value) * 1.8 + 32) * 100) / 100;
    }
  
    // function toCelsius(value){
    //   return (parseInt(value) - 32)/1.8;
    // }
  
    simulator("Vehicle.Cabin.Seat.Row1.Pos1.Position", "get", async () => {
      return systemDictionary.seatPosition.val;
    });
    simulator("Vehicle.Cabin.Lights.Spotlight.Row1.IsLeftOn", "get", async () => {
      return interiorLight;
    });
    simulator("Vehicle.Cabin.Infotainment.Media.Played.URI", "get", async () => {
      return systemDictionary.musicURI.val;
    });
    simulator("Vehicle.Body.Mirrors.Left.Tilt", "get", async () => {
      return systemDictionary.mirrorLeftTilt.val;
    });
    simulator("Vehicle.Body.Mirrors.Left.Pan", "get", async () => {
      return systemDictionary.mirrorLeftPan.val;
    });
    simulator("Vehicle.Body.Mirrors.Right.Tilt", "get", async () => {
      return systemDictionary.mirrorRightTilt.val;
    });
    simulator("Vehicle.Body.Mirrors.Right.Pan", "get", async () => {
      return systemDictionary.mirrorRightPan.val;
    });
  
    widgets.register("BigBox", (box) => {
      box.injectNode(bigBoxModule);
    });
  
    return {
      start: function () {
        firstRunFlag = false;
        
        if(selectedDriverName == "NBAPlayer"){
          playVideo("manWalk","");
        }else if(selectedDriverName == "Wife"){
          playVideo("womanWalk","");
        }else{
          bigBoxModule.querySelector("#displayVideo").style.display = "block";
        }
      },
      refresh: function () {
        if(firstRunFlag == false){
          bigBoxModule.querySelector("#displayCockpit").style.display = "none";
          bigBoxModule.querySelector("#coverImg").style.display ="inline-block";
  
          curTree = flowChartTree;
          drawFlag = true;
          dividing = false;
          previousVal = null;
          previousType = null;
          moveDirection = null;
          isPersonal = false;
          did = setInterval(catchDoorSignal, 500);
          sid = setInterval(catchSeatSignal, 500);
          let videoList = bigBoxModule.querySelectorAll(".bigBoxVideo");
          for (let videoItem of videoList) {
            videoItem.style.display = "none";
            videoItem.currentTime=0;
          }
          bigBoxModule.querySelector("#bottomLightDiv").style.boxShadow = "0px 0px 0px 0px #000000";
          let hideList = bigBoxModule.querySelectorAll(".imgToHide");
          for (let hideItem of hideList) {
            hideItem.style.display = "none";
          }
          let clearList = bigBoxModule.querySelectorAll(".textToClear");
          for (let clearItem of clearList) {
            clearItem.innerHTML = "";
          }
        }
        
      },
      nextStepPY: function () {
        nextStep();
        return "return";
      },
      isPersonalPY: function () {
        return isPersonal;
      },
      selectDriver: function () {
        nextStep();
        setTimeout(function () {
          nextStep();
        }, 2000);
        setTimeout(function () {
          nextStep();
        }, 4000);
        setTimeout(function () {
          nextStep();
        }, 6000);
        setTimeout(function () {
          nextStep();
        }, 8000);
  
        if (isPersonal == false) {
          setTimeout(function () {
            nextStep();
          }, 10000);
        }
        return [true, isPersonal];
      },
      setWelcome: function () {
        // if (systemDictionary.welcomeWord.val != null) {
        //   bigBoxModule.querySelector("#welcomeWord").innerHTML =
        //     systemDictionary.welcomeWord.val;
        // }
      },
      setPersonalizedWelcomeWord: function () {
        // if (systemDictionary.welcomeWord.val != null) {
        //   bigBoxModule.querySelector("#welcomeWord").innerHTML =
        //     systemDictionary.welcomeWord.val;
        // }
      },
      setPersonalizedUIInterface: function () {
        // if (systemDictionary.UIInterface.val != null) {
        //   bigBoxModule.querySelector("#UI").style.background =
        //     systemDictionary.UIInterface.val;
        // }
      },
      setPreferLanguage: function () {
        // if (systemDictionary.language.val != null) {
        //   bigBoxModule.querySelector("#language").innerHTML =
        //     systemDictionary.language.val;
        // }
      },
      setUSMetricUnits: function () {
        let targetDiv = bigBoxModule.querySelector("#unitSpan");
        if(systemDictionary.USMetricUnit.val == "Metric"){
          targetDiv.innerHTML = "km/h";
        }else if (systemDictionary.USMetricUnit.val == "US"){
          targetDiv.innerHTML = "mile/h"
        }
        
      },
      setInteriorLight: function () {
        // console.log("set interior light");
        let colorDiv = bigBoxModule.querySelector("#bottomLightDiv");
        colorDiv.style.boxShadow =
          "0px 0px 20px 10px #" + systemDictionary["InteriorLight"].val;
        // console.log("#" + systemDictionary["InteriorLight"].val);
      },
      setParkingWarningBeepLevel: function () {
        bigBoxModule.querySelector("#ParkingBeepSpan").innerHTML = "Parking beep";
        if (systemDictionary.parkingBeepLevel.val == "Off") {
          bigBoxModule.querySelector("#volumeDisableParkingImage").style.display =
            "inline-block";
        } else if (systemDictionary.parkingBeepLevel.val == "Low") {
          bigBoxModule.querySelector("#volumeLowParkingImage").style.display =
            "inline-block";
        } else if (systemDictionary.parkingBeepLevel.val == "Medium") {
          bigBoxModule.querySelector("#volumeMediumParkingImage").style.display =
            "inline-block";
        } else if (systemDictionary.parkingBeepLevel.val == "High") {
          bigBoxModule.querySelector("#volumeHighParkingImage").style.display =
            "inline-block";
        }
      },
      turnOnPreferredMusic: function () {
        let musicNameHere = systemDictionary.musicURI.val;
        if (musicNameHere != null) {
          playStatus = true;
          let audioHere = bigBoxModule.querySelector("#musicPanel");
          audioHere.src = musicDictionary[musicNameHere].mediaURL;
          audioHere.play();
          bigBoxModule.querySelector("#albumImage").style.backgroundImage =
            "url('" + musicDictionary[musicNameHere].imageURL + "')";
          
          bigBoxModule.querySelector("#musicName").innerHTML = musicNameHere;
          bigBoxModule.querySelector("#musicAuthor").innerHTML =
            musicDictionary[musicNameHere].author;
          bigBoxModule.querySelector("#bottomIconLine1Div").style.display =
            "inline-block";
        }
        return systemDictionary.musicURI.val;
      },
      setSeatPosition: function () {
        return systemDictionary.seatPosition.val;
      },
      setAutoHold: function () {
        if (systemDictionary.AutoHold.val == "On") {
          bigBoxModule.querySelector("#autoHoldImage").style.display =
            "inline-block";
        }
      },
      setMirrorStatus: function () {},
  
      setOnePuddleDrive: function(){
  
        if(systemDictionary["OnePuddle"].val == "On"){
          // console.log("one puddle");
          bigBoxModule.querySelector("#OnePuddleDriveImage").style.display = "inline-block";
        }
      },
  
      setDriveMode: function () {
        let targetDiv = bigBoxModule.querySelector("#driveModeSpan");
        targetDiv.innerHTML = systemDictionary.driveMode.val;
      },
      getOutsideTemperature: function () {
        return OutsideTemperature;
      },
      turnOnSetAC: function (ACMode) {
        if (ACMode == "warm AC") {
          bigBoxModule.querySelector("#ACImage").style.display = "inline-block";
          ACOnOff = true;
          let temp = systemDictionary["ACTemperatureIfCold"].val;
          if (systemDictionary.USMetricUnit.val == "US") {
            bigBoxModule.querySelector("#AC-temperature").innerHTML =
              toFahrenheit(temp);
            bigBoxModule.querySelector("#AC-temperature-unit").innerHTML = " °F";
          } else if (systemDictionary.USMetricUnit.val == "Metric") {
            bigBoxModule.querySelector("#AC-temperature").innerHTML = temp;
            bigBoxModule.querySelector("#AC-temperature-unit").innerHTML = " °C";
          }
        } else if (ACMode == "cool AC") {
          bigBoxModule.querySelector("#ACImage").style.display = "inline-block";
          ACOnOff = true;
          let temp = systemDictionary["ACTemperatureIfHot"].val;
          if (systemDictionary.USMetricUnit.val == "US") {
            bigBoxModule.querySelector("#AC-temperature").innerHTML =
              toFahrenheit(temp);
            bigBoxModule.querySelector("#AC-temperature-unit").innerHTML = " °F";
          } else if (systemDictionary.USMetricUnit.val == "Metric") {
            bigBoxModule.querySelector("#AC-temperature").innerHTML = temp;
            bigBoxModule.querySelector("#AC-temperature-unit").innerHTML = " °C";
          }
        }
  
        // console.log(ACMode);
      },
      turnOnSeatHeat: function () {
        if (systemDictionary.SeatHeatLevel.val > 0) {
          bigBoxModule.querySelector("#SeatHeatImage").style.display =
            "inline-block";
        }
      },
      turnSteeringWheelWarm: function () {
        // console.log("steering warm :" + systemDictionary.SteeringWheelWarm.val);
        if (systemDictionary.SteeringWheelWarm.val > 0) {
          bigBoxModule.querySelector("#SteeringWheelWarmImage").style.display =
            "inline-block";
          // let tempList = bigBoxModule.querySelectorAll(".steeringWheelWarmLevelImage");
          // for(let i = 0;i<systemDictionary.SteeringWheelWarm.val;i++){
          //   tempList[i].style.display = "inline-block";
          // }
          // // console.log("here");
        }
      },
      turnOnSeatVentilation: function () {
        if (systemDictionary.SeatVentilation.val > 0) {
          bigBoxModule.querySelector("#SeatVentilationImage").style.display =
            "inline-block";
        }
      },
      setACAirFlow: function () {
        if (ACOnOff) {
          let tempList = bigBoxModule.querySelectorAll(".ACAirFlowLevelImage");
          for (let i = 0; i < systemDictionary.ACAirFlowLevel.val; i++) {
            tempList[i].style.display = "inline-block";
          }
        }
      },
      setADASWarningBeepLevel: function () {
        bigBoxModule.querySelector("#ADASBeepSpan").innerHTML = "ADAS beep";
        if (systemDictionary.ADASBeepLevel.val == "Off") {
          bigBoxModule.querySelector("#volumeDisableImage").style.display =
            "inline-block";
        } else if (systemDictionary.ADASBeepLevel.val == "Low") {
          bigBoxModule.querySelector("#volumeLowImage").style.display =
            "inline-block";
        } else if (systemDictionary.ADASBeepLevel.val == "Medium") {
          bigBoxModule.querySelector("#volumeMediumImage").style.display =
            "inline-block";
        } else if (systemDictionary.ADASBeepLevel.val == "High") {
          bigBoxModule.querySelector("#volumeHighImage").style.display =
            "inline-block";
        }
      },
      displayCockpitPY: function () {
        displayCockpit();
      },
      displayVideoPY: function () {},
      
    };
  };
  
  function readTextFile(fileName) {
    var rawFile = new XMLHttpRequest();
    var infoList = [];
    rawFile.open("GET", fileName, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200 || rawFile.status == 0) {
          var allText = rawFile.responseText.toString();
          // alert(allText);
          infoList = allText.split("\n");
        }
      }
    };
    rawFile.send(null);
    return infoList;
  }
  
  function analysisTxt(txt) {
    // console.log("analysis");
  
    let dictionaryInfo = {};
    let dictionaryDriver = {};
    let identInfo = null;
    let identName = null;
    let key;
    let value;
  
    for (var i = 0; i < txt.length; i++) {
      identInfo = txt[i].split("#");
      identName = identInfo.shift().split(":")[1];
      var innerTuple = {};
      for (var j = 0; j < identInfo.length; j++) {
        key = identInfo[j].split(":")[0];
        value = identInfo[j].split(":")[1];
        innerTuple = {
          val: value,
          onOff: false,
        };
        dictionaryInfo[key] = innerTuple;
      }
      dictionaryDriver[identName] = dictionaryInfo;
      dictionaryInfo = {};
      innerTuple = {};
    }
  
    // console.log(dictionaryDriver);
    return dictionaryDriver;
  }
  
  export default plugin;
  
