export default () => {
  routesCalc = []
  // routesOrder = [];
  routesCalcDirections = []
  // var jsonArr = new Object();
  // jsonArr.routes_list = routesCalc;
  // var resJson = JSON.stringify(jsonArr);
  // alert(resJson);
  serverFolder = 'quiti_rest_misha_test'
  routeCalculation = false
  lastSelectedDTP = null
  firstSelectedDTP = null
  previousDTPUnchanged = false
  routeCalculated = false
  emailFillText = 'Пожалуйста, укажите e-mail'
  phoneFillText = 'Пожалуйста, укажите номер телефона'
  nameFillText = 'Пожалуйста, укажите Ваши фамилию, имя, отчество'
  fromTooltipText =
    'Вы можете ввести адрес вручную и выбрать его из предложенных вариантов, а можете указать точку на карте, нажав на красный значок.'
  dtpTooltipText =
    'Вы можете указать либо время отправления, либо время прибытия. Второе значение будет рассчитано автоматически. Если нужно дополнительно посидеть с ребёнком – просто добавьте время в нужную сторону.'
  serverURL = 'https://quiti.quiti.ru/api'
  currentSessionToken = null
  mapInitialized = false
  previousLoginState = localStorage.getItem('userLoggedIn')
  // if(localStorage.getItem("userLoggedIn")) previousLoginState = localStorage.getItem("userLoggedIn");

  $(function () {
    $(window).bind('pageshow', function () {
      var form = $('form')
      // let the browser natively reset defaults
      form[0].reset()
    })

    // $('#wrongAlert').toast({delay: 1});
    // $('#wrongAlert').toast('show');
    // $('#wrongAlert').toast('hide');

    $('#fromLabel').tooltip({ title: fromTooltipText, placement: 'right' })
    $('#fromDTPLabel').tooltip({ title: dtpTooltipText, placement: 'right' })

    var route = new Object()
    route.route_duration = 0
    route.babysitting_time = 0
    routesCalc.push(route)
    autocompleteSorryText =
      "Извините, не удается найти такой адрес <br> Попробуйте воспользоваться картой <i class='fa fa-map-marker'></i> <br> или добавить почтовый индекс"
    routesCalcDirections.push('')
  })

  $(function () {
    var today = new Date()
    var tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    var tomorrow1 = new Date()
    tomorrow1.setDate(tomorrow.getDate())
    tomorrow1.setMinutes(tomorrow1.getMinutes() + 1)
    tomorrow1.setSeconds(0)
    tomorrow1.setMilliseconds(0)
    var lastDate = new Date()
    lastDate.setDate(tomorrow.getDate() + 183)

    $('#datetimepicker').datetimepicker({
      locale: 'ru',
      timeZone: 'UTC+3',
      minDate: tomorrow,
      maxDate: lastDate,
      date: tomorrow1,
    })
    $('#datetimepicker').val('')

    $('#datetimepicker1').datetimepicker({
      locale: 'ru',
      timeZone: 'UTC+3',
      minDate: tomorrow,
      maxDate: lastDate,
      date: tomorrow1,
    })
    $('#datetimepicker1').val('')

    $('#datetimepicker').on('dp.hide', function (e) {
      if ($('#datetimepicker').val() === '') {
        $(this).data('DateTimePicker').date(tomorrow1)
        console.log($(this).data('DateTimePicker').date())
      }
      if (firstSelectedDTP === null) firstSelectedDTP = $('#datetimepicker')
      lastSelectedDTP = $('#datetimepicker')
      // if(!routeCalculation){
      //   checkRoutes($("#datetimepicker"));
      //   }
      if (firstSelectedDTP.is($(this))) {
        checkRoutes($(this))
      } else {
        var maxDt = $(this).data('DateTimePicker').maxDate() //максимальная дата и время ограничиваемая выбором времени прибытия
        var selectedDt = $(this).data('DateTimePicker').date() //выбранная дата и время
        var ms = maxDt.diff(selectedDt) //разница между максимальной и выбранной датой в мс
        var babysittingTime = moment.duration(ms).asMinutes() //результирующее время бебиситтинга в минутах
        routesCalc[0].babysitting_time = babysittingTime //установка времени бебиситтинга к маршруту для расчёта цены
        // alert(routesCalc[0].babysitting_time);
        requestCost()
      }
    })

    $('#datetimepicker').on('dp.change', function (e) {
      if (e.date === false) {
        $(this).data('DateTimePicker').date(e.oldDate)
      }
    })

    $('#datetimepicker1').on('dp.hide', function (e) {
      if ($('#datetimepicker1').val() === '') {
        $(this).data('DateTimePicker').date(tomorrow1)
      }
      if (firstSelectedDTP === null) firstSelectedDTP = $('#datetimepicker1')
      lastSelectedDTP = $('#datetimepicker1')
      if (firstSelectedDTP.is($(this))) {
        checkRoutes($(this))
      } else {
        var minDt = $(this).data('DateTimePicker').minDate() //минимальная дата и время ограничиваемая выбором времени отправления
        // console.log(minDt);
        var selectedDt = $(this).data('DateTimePicker').date() //выбранная дата и время
        // console.log(selectedDt);
        var ms = selectedDt.diff(minDt) //разница между минимальной и выбранной датой в мс
        // console.log(ms);
        var babysittingTime = moment.duration(ms).asMinutes() //результирующее время бебиситтинга в минутах
        // console.log(babysittingTime);
        routesCalc[0].babysitting_time = babysittingTime //установка времени бебиситтинга к маршруту для расчёта цены
        requestCost()
        // alert(routesCalc[0].babysitting_time);
      }
    })

    $('#datetimepicker1').on('dp.change', function (e) {
      if (e.date === false) {
        $(this).data('DateTimePicker').date(e.oldDate)
      }
    })

    // $("#datetimepicker").on("dp.change", function(e){
    //   if(firstSelectedDTP === null) firstSelectedDTP = $("#datetimepicker");
    //   lastSelectedDTP = $("#datetimepicker");
    //   // if(!routeCalculation){
    //   //   checkRoutes($("#datetimepicker"));
    //   //   }
    //     if(firstSelectedDTP.is($(this))){
    //     checkRoutes($(this));
    //     }
    // });

    // $("#datetimepicker1").on("dp.change", function(e){
    //   if(firstSelectedDTP === null) firstSelectedDTP = $("#datetimepicker1");
    //   lastSelectedDTP = $("#datetimepicker1");
    //   // if(!routeCalculation){
    //   //   checkRoutes($("#datetimepicker1"));
    //   // }
    //   if(firstSelectedDTP.is($(this))){
    //     checkRoutes($(this));
    //     }
    //     else{
    //       var dtpMomentSelected = $(this).data("DateTimePicker").date();
    //       var dtpMomentMin = $(this).data("DateTimePicker").minDate();
    //       var ms = dtpMomentSelected.diff(dtpMomentMin);
    //       var babysittingTime = moment.duration(ms).asMinutes();
    //       // alert(babysittingTime);
    //       var dtpId = $(this).attr('id');
    //       var dtpOrdinalNum = parseInt(dtpId[dtpId.length - 1]); //порядковый номер календаря для расчёта время бейбиситтинга
    //       routesCalc[dtpOrdinalNum - 1].babysitting_time = babysittingTime;//задающий календарь связан с маршрутом, номер которого меньше на 1
    //       requestCost();
    //       if(babysittingTime > 0){
    //         $("#addButton").attr('available', '');
    //       }
    //       else{
    //         $("#addButton").removeAttr('available');
    //       }
    //     }
    // });

    $('#datetimepicker1').on('showToast', function (e) {
      // alert("toast");
      $('#babysittingToast').toast({ delay: 5000 })
      $('#babysittingToast').toast('show')
    })

    // var myString = "datetimepicker1";
    // alert(parseInt(myString[myString.length - 1]));

    // var dtpMoment = $("#datetimepicker").data("DateTimePicker").date();
    // alert(dtpMoment);
    // dtpMoment.add(100, 'minutes');
    // alert(dtpMoment);
    // $('#datetimepicker1').data("DateTimePicker").minDate(dtpMoment);
    // $('#datetimepicker1').data("DateTimePicker").date(dtpMoment);

    // $("#datetimepicker").on("dp.change", function(e){
    //   // var dt = new Date(e.date);
    //   // dt.setMinutes(dt.getMinutes() - 1);
    //   $("#datetimepicker1").data("DateTimePicker").minDate(e.date);
    //   // checkRoutes($("#datetimepicker"));
    //   alert("change DT");
    // });

    // $("#datetimepicker").on("dp.update", function(e){
    //   alert("update DT");
    // });

    // $("#datetimepicker1").on("dp.change", function(e){
    //   // checkRoutes($("#datetimepicker1"));
    //   alert("change DT1");
    // });

    // $("#datetimepicker1").on("dp.update", function(e){
    //   alert("update DT1");
    // });
  })

  $(document).ready(function () {
    $('[data-toggle="popover"]').popover()
  })

  function addDestination(button) {
    //создание контейнера блока указания следующей точки маршрута
    // var newWhereBlock = $("<div class='row'>New row</div>");
    var lastWhereBlockIndex = $('.whereBlock').length
    // alert(lastWhereBlockIndex);
    var newWhereBlockIndex = lastWhereBlockIndex + 1
    // alert(newWhereBlockIndex);
    var newWhereBlockID = 'whereBlock' + newWhereBlockIndex.toString()
    // alert(newWhereBlockID);
    var newWhereBlock = $("<div class='row'></div>")
    newWhereBlock.addClass('whereBlock')
    newWhereBlock.attr('id', newWhereBlockID)
    var lastWhereBlockSelector = '#whereBlock' + lastWhereBlockIndex.toString()
    // alert(lastWhereBlockSelector);

    //создание внутренних компонентов
    var deleteButtonContainer = $("<div class='col-12'></div>")
    var deleteButton = $(
      "<button type='button' class='btn btn-danger btn-sm btn-circle-sm float-right p-0 m-0' onclick='removeDestination(this)'><i class='fa fa-times'></i></button>"
    )
    deleteButtonContainer.append(deleteButton)
    newWhereBlock.append(deleteButtonContainer)
    //подпись к полю ввода
    var newInputID = 'where' + newWhereBlockIndex.toString()
    var label = $("<label class='font-weight-bold text-white'>Куда:</label>")
    label.attr('for', newInputID)

    var inputContainer = $("<div class='input-group'></div>") //контейнер группы элементов ввода

    //поле ввода
    var inputField = $(
      "<input type='text' class='form-control' placeholder='Адрес' was-selected='false' required/>"
    )
    inputField.attr('id', newInputID)
    var newInputName = 'arrival_address' + newWhereBlockIndex.toString()
    inputField.attr('name', newInputName)

    //кнопка открытия карты
    var mapButton = $(
      "<div class='input-group-append'><button class='btn btn-light' type='button' data-toggle='modal' data-target='#mapModal' data-lat='55.750283' data-lng='37.623976'><i class='fa fa-map-marker'></i></button></div>"
    )

    //формирование контента левого столбца
    inputContainer.append(inputField, mapButton)
    var leftColumn = $("<div class='form-group col-sm-6'></div>") //столбец в полсетки
    leftColumn.append(label, inputContainer)
    newWhereBlock.append(leftColumn) //добавляем левый столбец к контейнеру

    // var parentInput  = $(this).closest('.input-group').find('input');
    // parentInput.attr('id');

    //подпись к календарю
    var newDTPickerID = 'datetimepicker' + newWhereBlockIndex.toString()
    var labelDTPicker = $(
      "<label class='font-weight-bold text-white'>Время прибытия:</label>"
    )
    labelDTPicker.attr('for', newDTPickerID)

    var dtPickerContainer = $("<div class='input-group date'></div>") //котейнер для календаря

    //поле ввода
    var inputDTPicker = $(
      "<input type='text' class='form-control' placeholder='Дата и время' autocomplete = 'off' required/>"
    )
    inputDTPicker.attr('id', newDTPickerID)
    var newDTPickerName = 'arrival_time' + newWhereBlockIndex.toString()
    inputDTPicker.attr('name', newDTPickerName)

    //кнопка календаря
    var calendarButton = $(
      "<span class='input-group-addon'><span class='glyphicon-calendar glyphicon'></span></span>"
    )

    //формирование контента правого столбца
    dtPickerContainer.append(inputDTPicker, calendarButton)
    var rightColumn = $("<div class='form-group col-sm-6'></div>") //столбец в полсетки
    rightColumn.append(labelDTPicker, dtPickerContainer)
    newWhereBlock.append(rightColumn)

    $(lastWhereBlockSelector).after(newWhereBlock)

    if ($(lastWhereBlockSelector).find('.btn-danger').length > 0) {
      $(lastWhereBlockSelector).find('.btn-danger').attr('disabled', '')
    }

    var route = new Object()
    route.route_duration = 0
    route.babysitting_time = 0
    routesCalc.push(route)

    routesCalcDirections.push('')

    var today = new Date()
    var tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    var lastDate = new Date()
    lastDate.setDate(tomorrow.getDate() + 183)

    var startDate = $('#' + 'datetimepicker' + lastWhereBlockIndex.toString())
      .data('DateTimePicker')
      .date()
      .toDate()

    $('#' + newDTPickerID).datetimepicker({
      locale: 'ru',
      timeZone: 'UTC+3',
      minDate: startDate,
      maxDate: lastDate,
      date: startDate,
    })

    $('#addButton').attr('disabled', '')
    $('#orderButton').attr('disabled', '')
    $('#' + 'datetimepicker' + lastWhereBlockIndex.toString()).on(
      'dp.change',
      function (e) {
        if (previousDTPUnchanged) {
          previousDTPUnchanged = false
        } else if (e.date === false) {
          $(this).data('DateTimePicker').date(e.oldDate)
          previousDTPUnchanged = true
        } else {
          // alert('dp.change');
          $('#' + newDTPickerID)
            .data('DateTimePicker')
            .minDate(e.date) //установить минимальную дату последующему пикеру
          $('#' + newDTPickerID)
            .data('DateTimePicker')
            .date(e.date)
          var dtpId = $(this).attr('id') //получаем ID пикера
          var dtpOrdinalNum = parseInt(dtpId[dtpId.length - 1]) //порядковый номер календаря для расчёта время бейбиситтинга
          routesCalc[dtpOrdinalNum - 1].babysitting_time = 0 //задающий календарь связан с маршрутом, номер которого в массиве маршрутов меньше на 1
          checkRoutes($('#' + newDTPickerID))
        }
      }
    )

    $('#' + newDTPickerID).on('dp.hide', function (e) {
      // checkRoutes(this);
      var addrInputF = $(this)
        .parent()
        .parent()
        .parent()
        .find('.ui-autocomplete-input')
      if ($(addrInputF).attr('was-selected') === 'true') {
        var dtpMomentSelected = $(this).data('DateTimePicker').date() //выбранное время
        var dtpMomentMin = $(this).data('DateTimePicker').minDate() //минимальное время, ограниченное длительностью маршрута
        var ms = dtpMomentSelected.diff(dtpMomentMin) //разница между выбранным и минимальным временем, в милисекундах
        var babysittingTime = moment.duration(ms).asMinutes() //создание moment.duration в минутах из полученной разницы
        // alert(babysittingTime);
        var dtpId = $(this).attr('id') //получаем ID пикера
        var dtpOrdinalNum = parseInt(dtpId[dtpId.length - 1]) //порядковый номер календаря для расчёта время бейбиситтинга
        routesCalc[dtpOrdinalNum - 2].babysitting_time = babysittingTime //задающий календарь связан с маршрутом, номер которого в массивк маршрутов меньше на 2
        // alert(routesCalc[dtpOrdinalNum - 2].babysitting_time);
        // alert(babysittingTime);
        requestCost()
        if (babysittingTime > 0) {
          $('#addButton').removeAttr('disabled')
        } else {
          $('#addButton').attr('disabled', '')
        }
      }
    })

    $('#' + newDTPickerID).on('dp.change', function (e) {
      if (e.date === false) {
        $(this).data('DateTimePicker').date(e.oldDate)
      }
    })

    makeAutocomplete($('#' + newInputID))
    routeCalculated = false
  }

  function removeDestination(element) {
    var currentBlockID = $(element).parent().parent().attr('id')
    var previousBlockIndex = parseInt(currentBlockID.slice(-1)) - 1
    var previousBlockSelector = '#whereBlock' + previousBlockIndex.toString()
    if ($(previousBlockSelector).find('.btn-danger').length > 0) {
      $(previousBlockSelector).find('.btn-danger').removeAttr('disabled')
    }
    $(element).parent().parent().remove()
    routesCalc.pop()
    routesCalcDirections.pop()
    $('#addButton').removeAttr('disabled')
    // $("#orderButton").removeAttr('disabled');
    requestCost()
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
      return (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    })
  }
  sessionToken = null

  var toggleAutocomplete = false

  function makeAutocomplete(inputElement) {
    $(inputElement).on('focusin', function () {
      $(this).data('val', $(this).val())
    })

    $(inputElement).on('keyup change paste', function (event) {
      if (
        inputElement.attr('was-selected') === 'true' &&
        toggleAutocomplete === true
      ) {
        toggleAutocomplete = false
        console.log('toggled')
      }

      var prev = $(this).data('val')
      var current = $(this).val()
      console.log('Prev value ' + prev)
      console.log('New value ' + current)
      if (prev !== current) {
        console.log('changed')
        inputElement.attr('was-selected', 'false')
        routeCalculated = false
        $('#addButton').attr('disabled', '')
        $('#orderButton').attr('disabled', '')
      }
    })

    $(inputElement)
      .autocomplete({
        source: function (request, response) {
          showAutocompleteLoader(inputElement)
          var rqstData = new Object()
          rqstData.input_addr = request.term
          if (currentSessionToken !== null) {
            rqstData.session_token = currentSessionToken
          }

          $.ajax({
            url: serverURL + '/autocomplete',
            dataType: 'json',
            data: rqstData,
            crossDomain: true,
            timeout: 10000,
            success: function (data) {
              hideAutocompleteLoader(inputElement)
              var result = []
              if (typeof data.output_addresses !== 'undefined') {
                for (var i = 0; i < data.output_addresses.length; i++) {
                  if (
                    data.output_addresses[i].types.indexOf('establishment') ===
                    -1
                  ) {
                    // var addr = data.output_addresses[i].address;
                    //TODO: Проверить в массиве, что "Россия" - последний элемент, если нет, то вывести полностью, если да, то исключить. Пересортировать элементы массива в обратном порядке.
                    // var NumCommas = (addr.match(/,/g) || []).length;
                    var addrLabel
                    // addrLabel = addr.split(",");
                    // if(addrLabel[addrLabel.length - 1] === " Россия"){
                    //   addrLabel.pop();
                    //   addrLabel.reverse();
                    // }
                    console.log(data.output_addresses[i].main_part)
                    console.log(data.output_addresses[i].secondary_part)
                    console.log(data.output_addresses[i].types)
                    addrLabel = data.output_addresses[i].secondary_part
                    addrLabel = addrLabel.split(',')
                    if (addrLabel.indexOf(' Россия') > -1) {
                      addrLabel.splice(addrLabel.indexOf(' Россия'), 1)
                      if (addrLabel.length > 1) {
                        addrLabel[0] = ' ' + addrLabel[0]
                      }
                      addrLabel.reverse()
                    }
                    if (addrLabel.indexOf(' Moscow Oblast') > -1) {
                      if (
                        addrLabel.indexOf('Москва') > -1 ||
                        addrLabel.indexOf('Московская область') > -1
                      ) {
                        addrLabel.splice(addrLabel.indexOf(' Moscow Oblast'), 1)
                      } else {
                        addrLabel[addrLabel.indexOf(' Moscow Oblast')] =
                          ' Московская область'
                      }
                    }
                    addrLabel.toString()
                    addrLabel =
                      addrLabel + ', ' + data.output_addresses[i].main_part
                    addrLabel.trim()
                    // if(NumCommas > 1){
                    //   addrLabel = addr.split(",");
                    //   addrLabel.pop();
                    //   addrLabel.pop();
                    //   console.log(addrLabel);
                    //   addrLabel.toString();
                    // }
                    // else{
                    //   addrLabel = addr.split(",");
                    //   addrLabel.pop();
                    //   addrLabel.toString();
                    // }
                    // console.log(addrLabel);
                    // console.log(addrLabel);

                    result.push({
                      label: addrLabel,
                      value: data.output_addresses[i].address,
                    })
                  }
                }
                if (result.length == 0) {
                  result.push({
                    label: autocompleteSorryText,
                    value: response.term,
                  })
                }
              } else {
                var result = [
                  {
                    label: autocompleteSorryText,
                    value: response.term,
                  },
                ]
              }
              if (typeof data.session_token !== 'undefined') {
                if (data.session_token !== currentSessionToken)
                  currentSessionToken = data.session_token
              }
              // alert(result.join("\n"));
              response(result)
            },
            error: function (jqXHR, exception) {
              $('#wrongAlert').toast({ delay: 5000 })
              $('#wrongAlert').toast('show')
              var msg = ''
              if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.'
              } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]'
              } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].'
              } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.'
              } else if (exception === 'timeout') {
                msg = 'Time out error.'
              } else if (exception === 'abort') {
                msg = 'Ajax request aborted.'
              } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText
              }
              console.log(msg)
            },
          })
        },
        minLength: 1,
        select: function (event, ui) {
          var label = ui.item.label
          if (label === autocompleteSorryText) {
            // this prevents "no results" from being selected
            event.preventDefault()
          } else {
            var selected = $(inputElement).attr('was-selected')
            if (selected === 'true') {
              console.log('Already selected!')
            } else if (selected === 'false') {
              event.preventDefault()
              $(inputElement).attr('was-selected', 'true')
              toggleAutocomplete = true
              $(inputElement).val(ui.item.label)
              $(this).data('val', $(this).val())
              // $(inputElement).blur();
              // updateRoute(inputElement);
              $.ajax({
                url: serverURL + '/geocoding',
                dataType: 'json',
                data: { selected_addr: ui.item.value },
                crossDomain: true,
                timeout: 10000,
                success: function (data) {
                  if (
                    typeof data.latitude !== undefined &&
                    typeof data.longitude !== undefined
                  ) {
                    $(inputElement).data('latlng', {
                      latitude: data.latitude.toString(),
                      longitude: data.longitude.toString(),
                    })
                    console.log($(inputElement).data('latlng'))
                    checkRoutes(inputElement)
                  } else {
                    console.log('Geocode data undefined')
                  }
                },
                error: function (jqXHR, exception) {
                  $('#wrongAlert').toast({ delay: 5000 })
                  $('#wrongAlert').toast('show')
                  var msg = ''
                  if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.'
                  } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]'
                  } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].'
                  } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.'
                  } else if (exception === 'timeout') {
                    msg = 'Time out error.'
                  } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.'
                  } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText
                  }
                  console.log(msg)
                },
              })
            } else {
              console.log('Error in autocomplete selection!')
            }
          }
        },
      })
      .autocomplete('instance')._renderItem = function (ul, item) {
      return (
        $("<li style='line-height: 1'>")
          // .append( "<div>" + item.label + "<br>" + "<span style='color:grey; font-size: 8pt'>" + item.value + "</span>" + "</div>" )
          .append('<div>' + item.label + '</div>')
          .appendTo(ul)
      )
    }
  }

  $(function () {
    makeAutocomplete($('#from1'))

    // var inputWhere = $("#where1");
    makeAutocomplete($('#where1'))
  })

  function updateRoute(inputElement) {
    $('.ui-autocomplete-input').index(inputElement)
  }

  var lastMarker = null

  function blockPage() {
    $('#loader').show()
  }

  function unblockPage() {
    $('#loader').hide()
  }

  function showAutocompleteLoader(element) {
    element.addClass('loadingAutocomplete')
  }

  function hideAutocompleteLoader(element) {
    element.removeClass('loadingAutocomplete')
  }

  function initMap(lat, lng, button) {
    if (isNaN(lat)) {
      console.log('lat was set to default')
      lat = 55.750283
    }
    if (isNaN(lng)) {
      console.log('lng was set to default')
      lng = 37.623976
    }

    myLatlng = new google.maps.LatLng(lat, lng)

    var MOSCOW_BOUNDS = {
      north: 56.073341,
      south: 55.375417,
      west: 37.074776,
      east: 38.2,
    }

    var myOptions = {
      zoom: 10,
      zoomControl: true,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      restriction: {
        latLngBounds: MOSCOW_BOUNDS,
        strictBounds: true,
      },
    }

    map = new google.maps.Map(document.getElementById('map_canvas'), myOptions)

    myMarker = new google.maps.Marker({
      position: myLatlng,
    })
    myMarker.setMap(map)
    lastMarker = myMarker

    // This event listener will call addMarker() when the map is clicked.
    map.addListener('click', function (event) {
      addMarker(event.latLng, button)
    })
  }

  function addMarker(latlng, button) {
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      draggable: true,
    })
    var infowindow = new google.maps.InfoWindow({
      content: '' + marker.getPosition() + '',
    })

    if (lastMarker !== null) {
      lastMarker.setMap(null)
    }
    lastMarker = marker

    var inputF = $(button).closest('.form-group').find('input')
    // inputF.val(latlng);
    inputF.data('latlng', {
      latitude: latlng.lat().toString(),
      longitude: latlng.lng().toString(),
    })
    $.ajax({
      url: serverURL + '/geocoding',
      type: 'POST',
      dataType: 'json',
      data: {
        latitude: latlng.lat().toString(),
        longitude: latlng.lng().toString(),
      },
      crossDomain: true,
      timeout: 10000,
      success: function (data) {
        if (data.status === 200) {
          var resultInput = data.output_addr.split(',')
          resultInput[0] = ' ' + resultInput[0]
          if (resultInput.indexOf(' Moscow Oblast') > -1) {
            resultInput[resultInput.indexOf(' Moscow Oblast')] =
              ' Московская область'
          }
          if (resultInput.length > 2 && /\d/.test(resultInput[1])) {
            var strSwap = resultInput[1]
            resultInput[1] = resultInput[0]
            resultInput[0] = strSwap
          }
          resultInput.reverse()
          resultInput.toString()
          inputF.val(resultInput)
        } else {
          console.log(data.status)
          inputF.val(latlng)
        }
      },
      error: function (jqXHR, exception) {
        inputF.val(latlng)
        $('#wrongAlert').toast({ delay: 5000 })
        $('#wrongAlert').toast('show')
        var msg = ''
        if (jqXHR.status === 0) {
          msg = 'Not connect.\n Verify Network.'
        } else if (jqXHR.status == 404) {
          msg = 'Requested page not found. [404]'
        } else if (jqXHR.status == 500) {
          msg = 'Internal Server Error [500].'
        } else if (exception === 'parsererror') {
          msg = 'Requested JSON parse failed.'
        } else if (exception === 'timeout') {
          msg = 'Time out error.'
        } else if (exception === 'abort') {
          msg = 'Ajax request aborted.'
        } else {
          msg = 'Uncaught Error.\n' + jqXHR.responseText
        }
        console.log(msg)
      },
    })

    var selected = $(inputF).attr('was-selected', 'true')
    checkRoutes(inputF)
  }

  $(document).ready(function () {
    // Re-init map before show modal
    var coordsSearched = false
    var coordsRcvd = false
    var lat
    var lon

    $('#mapModal').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)

      if (!coordsSearched) {
        coordsSearched = true
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(geoSuccess)
        }
      }

      function geoSuccess(position) {
        lat = position.coords.latitude
        lon = position.coords.longitude
        if (!mapInitialized) {
          initMap(lat, lon, button)
        }
        coordsRcvd = true
        // alert("success");
      }

      var addrInputElement = $(button).parent().parent().find('input')
      if (typeof $(addrInputElement).data('latlng') != 'undefined') {
        initMap(
          $(addrInputElement).data('latlng').latitude,
          $(addrInputElement).data('latlng').longitude,
          button
        )
        mapInitialized = true
      } else if (coordsRcvd === true) {
        initMap(lat, lon, button)
      } else {
        initMap(button.data('lat'), button.data('lng'), button)
      }
      $('#location-map').css('width', '100%')
      $('#map_canvas').css('width', '100%')
    })

    // Trigger map resize event after modal shown
    $('#mapModal').on('shown.bs.modal', function () {
      google.maps.event.trigger(map, 'resize')
      map.setCenter(myLatlng)
    })
  })

  $(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
      //the 'is' for buttons that trigger popups
      //the 'has' for icons within a button that triggers a popup
      if (
        !$(this).is(e.target) &&
        $(this).has(e.target).length === 0 &&
        $('.popover').has(e.target).length === 0
      ) {
        ;(
          ($(this).popover('hide').data('bs.popover') || {}).inState || {}
        ).click = false // fix for BS 3.3.6
      }
    })
  })

  function requestCost() {
    var allSelected = true
    $('[was-selected]').each(function () {
      if ($(this).attr('was-selected') === 'false') allSelected = false
    })

    if (allSelected) {
      var jsonArr = { routes_list: routesCalc }
      var resJson = JSON.stringify(jsonArr)
      var mode = 'driving'
      if ($("input[name='gridRadios']").length)
        mode = $("input[name='gridRadios']:checked").val()

      blockPage()

      $.ajax({
        url: serverURL + '/cost',
        dataType: 'json',
        data: {
          email: $('#e-mail').val(),
          // auth_token: 1234,
          order_datetime: $('#datetimepicker')
            .data('DateTimePicker')
            .date()
            .unix(),
          routes: resJson,
          mode: mode,
        },
        crossDomain: true,
        timeout: 10000,
        success: function (data) {
          unblockPage()
          if (
            typeof data.summary_cost !== undefined &&
            typeof data.summary_discount !== undefined &&
            typeof data.routes_cost !== undefined
          ) {
            routeCalculated = true
            $('#priceSum').text((data.summary_cost / 100).toString() + ' руб.')
            $('#priceSumMobile').text(
              (data.summary_cost / 100).toString() + ' руб.'
            )
            $('#discSum').text(
              (data.summary_discount / 100).toString() + ' руб.'
            )
            $('#addButton').removeAttr('disabled')
            if (checkOffer()) {
              $('#orderButton').removeAttr('disabled')
            }
          } else {
            console.log('Routes cost data undefined')
          }
        },
        error: function (jqXHR, exception) {
          $('#wrongAlert').toast({ delay: 5000 })
          $('#wrongAlert').toast('show')
          var msg = ''
          if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.'
          } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]'
          } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].'
          } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.'
          } else if (exception === 'timeout') {
            msg = 'Time out error.'
          } else if (exception === 'abort') {
            msg = 'Ajax request aborted.'
          } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText
          }
          console.log(msg)
        },
      })
    }
  }

  function checkRoutes(element) {
    // alert("checkRoutes");
    var allSelected = true
    $('[was-selected]').each(function () {
      if ($(this).attr('was-selected') === 'false') allSelected = false
    })

    if (allSelected) {
      // alert("All selected!");
      var points = []
      $('[was-selected]').each(function () {
        if ($(this).data('latlng') !== undefined) {
          points.push(JSON.stringify($(this).data('latlng')))
        }
      })

      var rqstData = new Object()
      // var dtpElement = lastSelectedDTP;
      var timeSelected = false

      // alert(lastSelectedDTP);

      if (firstSelectedDTP !== null) {
        var newBlock = false
        var elementBlockID = $(element).parent().parent().parent().attr('id')
        var elementBlockIndex
        var toDeparture = false
        if (typeof elementBlockID !== 'undefined') {
          elementBlockIndex = parseInt(
            elementBlockID[elementBlockID.length - 1]
          )
          if (elementBlockIndex > 1) {
            newBlock = true
          }
        }
        if (newBlock) {
          // alert(elementBlockIndex);
          rqstData.addr_pos1 = points[elementBlockIndex - 1]
          rqstData.addr_pos2 = points[elementBlockIndex]
          var pickerDate = $('#datetimepicker' + elementBlockIndex.toString())
            .data('DateTimePicker')
            .date()
          var pickerMinDate = $(
            '#datetimepicker' + elementBlockIndex.toString()
          )
            .data('DateTimePicker')
            .minDate()
          if (pickerMinDate.isSame(pickerDate)) {
            // alert("isSame");
            toDeparture = true
            rqstData.departure_time = $(
              '#datetimepicker' + elementBlockIndex.toString()
            )
              .data('DateTimePicker')
              .date()
              .unix()
            routesCalcDirections[elementBlockIndex - 1] = 'to_departure'
          } else {
            rqstData.arrival_time = $(
              '#datetimepicker' + elementBlockIndex.toString()
            )
              .data('DateTimePicker')
              .date()
              .unix()
            routesCalcDirections[elementBlockIndex - 1] = 'to_arrival'
          }
        } else if (firstSelectedDTP.attr('id') === 'datetimepicker') {
          rqstData.addr_pos1 = points[0]
          rqstData.addr_pos2 = points[1]
          rqstData.departure_time = firstSelectedDTP
            .data('DateTimePicker')
            .date()
            .unix()
          routesCalcDirections[0] = 'to_departure'
        } else if (firstSelectedDTP.attr('id') === 'datetimepicker1') {
          rqstData.addr_pos1 = points[0]
          rqstData.addr_pos2 = points[1]
          rqstData.arrival_time = firstSelectedDTP
            .data('DateTimePicker')
            .date()
            .unix()
          routesCalcDirections[0] = 'to_arrival'
        } else {
          console.log('Error while check routes!')
        }

        rqstData.mode = 'driving'
        if ($("input[name='gridRadios']").length)
          rqstData.mode = $("input[name='gridRadios']:checked").val()

        blockPage()

        $.ajax({
          url: serverURL + '/duration',
          dataType: 'json',
          data: rqstData,
          crossDomain: true,
          timeout: 10000,
          success: function (data) {
            routeCalculation = true
            // console.log(data.route_duration);
            // console.log(data.route_distance);

            var dtpDate = firstSelectedDTP.data('DateTimePicker').date()
            if (newBlock) {
              var pickerDate = $(
                '#datetimepicker' + elementBlockIndex.toString()
              )
                .data('DateTimePicker')
                .date()
              routesCalc[elementBlockIndex - 1].route_duration =
                data.route_duration
              if (toDeparture) {
                var previousPickerDate = $(
                  '#datetimepicker' + (elementBlockIndex - 1).toString()
                )
                  .data('DateTimePicker')
                  .date() //считать время предыдущего пикера
                previousPickerDate.add(data.route_duration, 'minutes')
                $('#datetimepicker' + elementBlockIndex.toString())
                  .data('DateTimePicker')
                  .minDate(previousPickerDate)
                $('#datetimepicker' + elementBlockIndex.toString())
                  .data('DateTimePicker')
                  .date(previousPickerDate)
              } else {
                var resultMoment = pickerDate.subtract(
                  data.route_duration,
                  'minutes'
                )
                if (
                  $('#datetimepicker' + elementBlockIndex.toString())
                    .data('DateTimePicker')
                    .minDate()
                    .isBefore(resultMoment)
                ) {
                  var ms = resultMoment.diff(
                    $('#datetimepicker' + elementBlockIndex.toString())
                      .data('DateTimePicker')
                      .minDate()
                  ) //разница между результирующим и минимальным временем, в милисекундах
                  var babysittingTime = moment.duration(ms).asMinutes() //создание moment.duration в минутах из полученной разницы
                  routesCalc[
                    elementBlockIndex - 1
                  ].babysitting_time = babysittingTime
                  // alert(routesCalc[elementBlockIndex - 1].babysitting_time);
                } else {
                  var pickerMinDate = $(
                    '#datetimepicker' + elementBlockIndex.toString()
                  )
                    .data('DateTimePicker')
                    .minDate()
                  var newPickerDate = pickerMinDate.add(
                    data.route_duration,
                    'minutes'
                  )
                  $('#datetimepicker' + elementBlockIndex.toString())
                    .data('DateTimePicker')
                    .date(newPickerDate)
                }
              }
              requestCost()
            } else if (firstSelectedDTP.attr('id') === 'datetimepicker') {
              // console.log(data.route_duration);
              // console.log(dtpDate);
              // console.log(dtpDate.seconds());
              dtpDate.add(data.route_duration, 'minutes')
              // console.log(dtpDate);
              // console.log(dtpDate.seconds());
              routesCalc[0].route_duration = data.route_duration
              routesCalc[0].babysitting_time = 0
              $('#datetimepicker1').data('DateTimePicker').minDate(dtpDate)
              $('#datetimepicker1').data('DateTimePicker').date(dtpDate)
              // console.log($("#datetimepicker1").data("DateTimePicker").date().seconds());
              // console.log($("#datetimepicker1").data("DateTimePicker").minDate().seconds());
              // console.log($("#datetimepicker1").data("DateTimePicker").date().seconds());
              routeCalculation = false
              $('#addButton').removeAttr('disabled')
              requestCost()
            } else if (firstSelectedDTP.attr('id') === 'datetimepicker1') {
              dtpDate.subtract(data.route_duration, 'minutes')
              // alert(dtpDate);
              routesCalc[0].route_duration = data.route_duration
              routesCalc[0].babysitting_time = 0
              if (
                $('#datetimepicker')
                  .data('DateTimePicker')
                  .minDate()
                  .isBefore(dtpDate)
              ) {
                $('#datetimepicker').data('DateTimePicker').maxDate(dtpDate)
                $('#datetimepicker').data('DateTimePicker').date(dtpDate)
                // $("#datetimepicker").data("DateTimePicker").minDate(dtpDate);
                // $("#datetimepicker").data("DateTimePicker").maxDate(dtpDate);
                routeCalculation = false
                $('#addButton').removeAttr('disabled')
                requestCost()
              } else {
                console.log(
                  'Длительность маршрута превышает минимальное время начала заказа ' +
                    $('#datetimepicker')
                      .data('DateTimePicker')
                      .minDate()
                      .toDate()
                      .toString() +
                    '. Пожалуйста, выберите другое время.'
                ) //TODO: show toast
              }
            } else {
              console.log('Something wrong in route duration handler!')
            }
          },
          error: function (jqXHR, exception) {
            $('#wrongAlert').toast({ delay: 5000 })
            $('#wrongAlert').toast('show')
            var msg = ''
            if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.'
            } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]'
            } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].'
            } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.'
            } else if (exception === 'timeout') {
              msg = 'Time out error.'
            } else if (exception === 'abort') {
              msg = 'Ajax request aborted.'
            } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText
            }
            console.log(msg)
          },
        })
        unblockPage()
        // routeCalculation = false;
        // alert(routeCalculation);
      }
    }
  }

  $(function () {
    $('#reloadButton').on('click', function () {
      window.location.reload(true)
    })

    $('#orderButton').on('click', function () {
      createOrder()
    })

    $('#offerCheck').on('change', function () {
      if ($(this).is(':checked')) {
        if (routeCalculated) {
          $('#orderButton').removeAttr('disabled')
        }
      } else {
        $('#orderButton').attr('disabled', '')
      }
    })
  })

  function checkOffer() {
    if ($('#offerCheck').is(':checked')) {
      return true
    }
    return false
  }

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/
    return regex.test(email)
  }

  function isName(name) {
    if (name.length > 1) {
      var regex = /^[а-яА-ЯёЁ ]+$/
      return regex.test(name)
    }
  }

  function isPhone(phone) {
    var regex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){7,14}(\s*)?$/
    return regex.test(phone)
  }

  function createOrder() {
    var emailCorrect = false
    var phoneCorrect = false
    var nameCorrect = false

    if (isEmail($('#e-mail').val())) {
      emailCorrect = true
    } else {
      $('#e-mail').tooltip({
        title: emailFillText,
        placement: 'top',
        trigger: 'manual',
      })
      $('#e-mail').tooltip('show')
      setTimeout(function () {
        $('#e-mail').tooltip('hide')
      }, 5000)
    }

    if (isPhone($('#phone').val())) {
      phoneCorrect = true
    } else {
      $('#phone').tooltip({
        title: phoneFillText,
        placement: 'top',
        trigger: 'manual',
      })
      $('#phone').tooltip('show')
      setTimeout(function () {
        $('#phone').tooltip('hide')
      }, 5000)
    }

    if (isName($('#FullName').val())) {
      nameCorrect = true
    } else {
      $('#FullName').tooltip({
        title: nameFillText,
        placement: 'top',
        trigger: 'manual',
      })
      $('#FullName').tooltip('show')
      setTimeout(function () {
        $('#FullName').tooltip('hide')
      }, 5000)
    }

    if (
      emailCorrect === true &&
      phoneCorrect === true &&
      nameCorrect === true
    ) {
      blockPage()
      var requestOrder = new Object()
      var orders = new Object()
      var routesOrder = []
      var allSelected = true
      $('[was-selected]').each(function () {
        if ($(this).attr('was-selected') === 'false') allSelected = false
      })

      if (allSelected) {
        // alert("All selected!");
        var order = new Object()
        var ordersArr = []
        var routesOrder = []
        var numOfInputs = $('[was-selected]').length
        // alert(numOfInputs);
        $('[was-selected]').each(function (index, element) {
          var dtpElement = $(element)
            .parent()
            .parent()
            .parent()
            .find('.date')
            .children()
            .first()
          var nextBlock = $(element)
            .parent()
            .parent()
            .parent()
            .next('.whereBlock')
            .first()
          if ($(nextBlock).length > 0) {
            var nextBlockDTP = $(nextBlock).find('.date').children().first()
            var nextBlockInputF = $(nextBlock).find('.ui-autocomplete-input')
            var route = {
              arrival_address: $(nextBlockInputF).val(),
              arrival_time: $(nextBlockDTP)
                .data('DateTimePicker')
                .date()
                .unix(),
              arrival_latitude: $(nextBlockInputF).data('latlng').latitude,
              arrival_longitude: $(nextBlockInputF).data('latlng').longitude,
              route_calc_direction: routesCalcDirections[index],
              departure_address: $(this).val(),
              departure_time: $(dtpElement)
                .data('DateTimePicker')
                .date()
                .unix(),
              departure_latitude: $(this).data('latlng').latitude,
              departure_longitude: $(this).data('latlng').longitude,
            }
            routesOrder.push(route)
          }
        })
        var commentStr = $('#comment1').val()
        commentStr = commentStr.replace(/(?:\r\n|\r|\n)/g, '<br>')
        var mode = 'driving'
        if ($("input[name='gridRadios']").length)
          mode = $("input[name='gridRadios']:checked").val()
        var order = {
          order_comment: commentStr,
          routes: routesOrder,
          mode: mode,
        }
        ordersArr.push(order)
        var ordersJSON = { orders: ordersArr }

        var communicationObj = {
          call: 'no',
          whatsapp: 'no',
          sms: 'no',
          email: 'no',
        }
        if ($('#checkCall').is(':checked')) {
          communicationObj.call = 'yes'
        }
        if ($('#checkEmail').is(':checked')) {
          communicationObj.email = 'yes'
        }
        if ($('#checkSMS').is(':checked')) {
          communicationObj.sms = 'yes'
        }
        if ($('#checkWhatsApp').is(':checked')) {
          communicationObj.whatsapp = 'yes'
        }

        $.ajax({
          url: serverURL + '/orders',
          type: 'POST',
          dataType: 'json',
          data: {
            email: $('#e-mail').val(),
            auth_token: 134425213,
            phone: $('#phone').val(),
            communication_methods: JSON.stringify(communicationObj),
            full_name: $('#FullName').val(),
            orders: JSON.stringify(ordersJSON),
          },
          crossDomain: true,
          timeout: 10000,
          success: function (data) {
            unblockPage()
            if (data.status === 200) {
              $('#redirectModal').modal({ backdrop: 'static' })
              setTimeout(function () {
                window.location.replace('https://quiti.ru/')
              }, 5000)
              // window.location.replace(data.payment_url);
            } else if (data.status === 401) {
              $('#wrongAlert').toast({ delay: 3000 })
              $('#wrongAlert').toast('show')
              if ($('#comm-meth-container').hasClass('d-none')) {
                $('#comm-meth-container').removeClass('d-none')
                $('#checkCall').prop('checked', false)
                $('#checkWhatsApp').prop('checked', false)
                $('#checkSMS').prop('checked', false)
                $('#checkEmail').prop('checked', false)
                $('#FullName').parent().parent().removeClass('d-none')
                $('#FullName').val('')
                $('#e-mail').parent().parent().removeClass('d-none')
                $('#e-mail').val('')
                $('#phone').val('')
              }
            } else {
              console.log(data.status)
              $('#wrongAlert').toast({ delay: 5000 })
              $('#wrongAlert').toast('show')
            }
          },
          error: function (jqXHR, exception) {
            $('#wrongAlert').toast({ delay: 5000 })
            $('#wrongAlert').toast('show')
            var msg = ''
            unblockPage()
            if (jqXHR.status === 0) {
              msg = 'Not connect.\n Verify Network.'
            } else if (jqXHR.status == 404) {
              msg = 'Requested page not found. [404]'
            } else if (jqXHR.status == 500) {
              msg = 'Internal Server Error [500].'
            } else if (exception === 'parsererror') {
              msg = 'Requested JSON parse failed.'
            } else if (exception === 'timeout') {
              msg = 'Time out error.'
            } else if (exception === 'abort') {
              msg = 'Ajax request aborted.'
            } else {
              msg = 'Uncaught Error.\n' + jqXHR.responseText
            }
            console.log(msg)
          },
        })
      }
    }
  }

  $(function () {
    // var dtpElementID = $("#from1").parent().parent().parent().next(".whereBlock").first();
    // alert(dtpElementID);
    //   var order = new Object();
    //   var ordersArr = [];
    //   var routesOrder = [];
    //   var route = {
    //           arrival_address: "some arrival",
    //           arrival_time: 123456,
    //           arrival_latitude: 54.55555,
    //           arrival_longitude: 45.4444444,
    //           route_calc_direction: "to_arrival",
    //           departure_address: "some_departure",
    //           departure_time: 6543156,
    //           departure_latitude: 45.4444444,
    //           departure_longitude: 54.55555
    //         }
    //         routesOrder.push(route);
    //         routesOrder.push(route);

    //   var order = { order_comment: "comment",
    //       routes: routesOrder};
    //       ordersArr.push(order);
    //       ordersArr.push(order);
    //       var ordersJSON = {orders: ordersArr};
    //       alert(JSON.stringify(ordersJSON));
    // });
    // var communicationObj = {call: "no", whatsapp: "no", sms: "no", email:"yes"};
    // alert(JSON.stringify(communicationObj));
    // $("#comment1").focusout(function() {
    //   var resStr = $(this).val();
    //   resStr = resStr.replace(/(?:\r\n|\r|\n)/g, '<br>');
    //   console.log(resStr);
    // });
    // var stR = "Norm \n string with \n break lines";
    // stR = stR.replace(/(?:\r\n|\r|\n)/g, '<br>');
    // console.log(stR);
    // $("#e-mail").tooltip({title: emailFillText, delay: 5000, placement:'top'});
    // $("#e-mail").tooltip("show");
    // $('#babysittingToast').toast({delay: 5000});
    //     $('#babysittingToast').toast('show');
    // $("#redirectModal").modal({backdrop: 'static'});
    // window.location.replace("https://quiti.ru/");
    // setTimeout(function() {
    //   alert("timeout started");
    //   window.location.replace("https://quiti.ru/");
    // }, 5000);
    // var ms = 45000; //разница между минимальной и выбранной датой в мс
    // var babysittingTime = moment.duration(ms).asMinutes(); //результирующее время бебиситтинга в минутах
    // alert(babysittingTime);
    // alert(babysittingTime.toString());
    // alert($("#datetimepicker").data("DateTimePicker").date().unix());
    // $("#datetimepicker").click(function(event){
    //   $(this).removeAttr('readonly').select().data("DateTimePicker").show();
    // });
    // $( "#datetimepicker").blur(function(event){
    //   $(this).attr('readonly', 'readonly');
    // });

    if (
      localStorage.getItem('userLoggedIn') &&
      localStorage.getItem('userLoggedIn') === 'yes'
    ) {
      var userID = localStorage.getItem('userID')

      //ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
      $.ajax({
        url: serverURL + '/user',
        xhrFields: {
          withCredentials: true,
        },
        type: 'GET',
        dataType: 'json',
        data: { action: 'get-user-data' },
        crossDomain: true,
        timeout: 10000,
        success: function (data) {
          // unblockPage();
          if (data.status === 200) {
            console.log(data.message)
            // console.log(data.user_data);
            $('#user-acc-link').text('Личный кабинет →')
            // quitiUserPageConditions.setUserID(data.user_data.user_id);
            $('#FullName').val(data.user_data.full_name)
            $('#e-mail').val(data.user_data.email)

            var phoneArr = JSON.parse(data.user_data.phone)

            $('#phone').val(phoneArr[0])

            var communicationMethods = JSON.parse(
              data.user_data.communication_methods
            )
            if (communicationMethods.call === 'yes') {
              $('#checkCall').prop('checked', true)
            }
            if (communicationMethods.whatsapp === 'yes') {
              $('#checkWhatsApp').prop('checked', true)
            }
            if (communicationMethods.sms === 'yes') {
              $('#checkSMS').prop('checked', true)
            }
            if (communicationMethods.email === 'yes') {
              $('#checkEmail').prop('checked', true)
            }

            $('#FullName').parent().parent().addClass('d-none')
            $('#phone').parent().parent().addClass('d-none')
            $('#comm-meth-container').addClass('d-none')
          } else if (data.status === 401) {
            // $("#response").html(data.message);
            localStorage.setItem('userLoggedIn', 'no')
            console.log(data.message)
          } else {
            console.log(data.status)
            $('#wrongAlert').toast({ delay: 5000 })
            $('#wrongAlert').toast('show')
          }
        },
        error: function (jqXHR, exception) {
          $('#wrongAlert').toast({ delay: 5000 })
          $('#wrongAlert').toast('show')
          var msg = ''
          // unblockPage();
          if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.'
          } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]'
          } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].'
          } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.'
          } else if (exception === 'timeout') {
            msg = 'Time out error.'
          } else if (exception === 'abort') {
            msg = 'Ajax request aborted.'
          } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText
          }
          console.log(msg)
        },
      })
    } else {
      $('#user-acc-link').text('Войти →')
    }

    $(window).focus(function () {
      if (
        previousLoginState &&
        previousLoginState !== localStorage.getItem('userLoggedIn')
      ) {
        //если предыдущее состояние существует и изменилось
        previousLoginState = localStorage.getItem('userLoggedIn') //теперь это текущее состояние
        if (previousLoginState === 'yes') {
          blockPage()
          var userID = localStorage.getItem('userID')

          //ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
          $.ajax({
            url: serverURL + '/user',
            xhrFields: {
              withCredentials: true,
            },
            type: 'GET',
            dataType: 'json',
            data: { action: 'get-user-data' },
            crossDomain: true,
            timeout: 10000,
            success: function (data) {
              unblockPage()
              if (data.status === 200) {
                console.log(data.message)
                // console.log(data.user_data);
                $('#user-acc-link').text('Личный кабинет →')
                // quitiUserPageConditions.setUserID(data.user_data.user_id);
                $('#FullName').val(data.user_data.full_name)
                $('#e-mail').val(data.user_data.email)

                var phoneArr = JSON.parse(data.user_data.phone)

                $('#phone').val(phoneArr[0])

                var communicationMethods = JSON.parse(
                  data.user_data.communication_methods
                )
                if (communicationMethods.call === 'yes') {
                  $('#checkCall').prop('checked', true)
                }
                if (communicationMethods.whatsapp === 'yes') {
                  $('#checkWhatsApp').prop('checked', true)
                }
                if (communicationMethods.sms === 'yes') {
                  $('#checkSMS').prop('checked', true)
                }
                if (communicationMethods.email === 'yes') {
                  $('#checkEmail').prop('checked', true)
                }

                $('#FullName').parent().parent().addClass('d-none')
                $('#phone').parent().parent().addClass('d-none')
                $('#comm-meth-container').addClass('d-none')
              } else if (data.status === 401) {
                // $("#response").html(data.message);
                localStorage.setItem('userLoggedIn', 'no')
                console.log(data.message)
              } else {
                console.log(data.status)
                $('#wrongAlert').toast({ delay: 5000 })
                $('#wrongAlert').toast('show')
              }
            },
            error: function (jqXHR, exception) {
              $('#wrongAlert').toast({ delay: 5000 })
              $('#wrongAlert').toast('show')
              var msg = ''
              unblockPage()
              if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.'
              } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]'
              } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].'
              } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.'
              } else if (exception === 'timeout') {
                msg = 'Time out error.'
              } else if (exception === 'abort') {
                msg = 'Ajax request aborted.'
              } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText
              }
              console.log(msg)
            },
          })
        } else {
          blockPage()
          if ($('#comm-meth-container').hasClass('d-none')) {
            $('#comm-meth-container').removeClass('d-none')
            $('#checkCall').prop('checked', false)
            $('#checkWhatsApp').prop('checked', false)
            $('#checkSMS').prop('checked', false)
            $('#checkEmail').prop('checked', false)
            $('#FullName').parent().parent().removeClass('d-none')
            $('#FullName').val('')
            $('#e-mail').parent().parent().removeClass('d-none')
            $('#e-mail').val('')
            $('#phone').val('')
          }
          setTimeout(function () {
            unblockPage()
          }, 1000)
        }
      }
    })

    window.onstorage = function (e) {
      //для того, чтобы форсировать обновление хранилища в некоторых браузерах
    }

    //обновить состояние калькулятора при изменении радио-кнопки типа сопровождения
    $("input[name='gridRadios']").change(function () {
      checkRoutes()
    })
  })
}
