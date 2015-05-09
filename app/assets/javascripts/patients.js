$(function(){
// $(document).on("ready page:change", function(){ 
if ($('body.patients').length) {
	// alert('patients.js');

	

	//DECLARE VARIABLES
	var ID = '';
	  	function set_id(x){ID = x};
	// alert('in inpatients.js');
	refreshgrid('nil');

	// STYLING
	$('#divPatientPageWrapper').addClass('pad_3_sides');
	$('#divPatientPageInnerWrapper').addClass('centered').css({'width':'75em'});
	$('#divPatientAsideRt').addClass('float_right').hide();

	$('#fPatientSearch').addClass('form_container').css({'width':'692px'});
	$('#btnSubmit').addClass('submit-button').hide();

	$('#divPatientAsideRt').addClass('form_container').css({'width':'250px'})

	//button
	$('[id^=b]').button().addClass('reduce_button')
	$('#lastname').addClass('input_field')
			$('#bEdit').click(function(){
				alert('from alert')
			});
	//dates
	$('[id^=dt]').datepicker().css({'width':'7em'});



	// BUTTONS
	$('#bNew').click(function(){
		// ajax_call('/inpatients/new2', 'POST');
		ajax_call('/patients', 'POST');
	});

	$('#bEdit').click(function(){
		ajax_call('/patients/'+ID+'', 'PATCH');
	});

	// Use the hidden submit button to submit whole form
			//Use event 'e' to prevent non-ajax submit
	$('#btnSubmit').click(function(e){
		alert('click and nothing else');
			var firstname = $('#ftx_S_Firstname').val();
			var lastname = $('#ftx_S_lastname').val();
			var number = $('#ftx_S_number').val();
			var facility = $('#ftx_S_facility').val();
			var ward = $('#slt_s_ward').val();

			$("#gridGrid").remove();         
			// $('#divGrid').html('<table id="divTable"></table><div id="divPager"></div>');
			url = '/patients_search?firstname='+firstname+'&lastname='+lastname+'&number='+number+'&facility='+facility+'&ward='+ward+''
			refreshgrid(url);
		e.preventDefault();
	});

	// $('#bSearch').click(function(){
	// 		var firstname = $('#ftx_S_Firstname').val();
	// 		var lastname = $('#ftx_S_lastname').val();
	// 		var number = $('#ftx_S_number').val();
	// 		var facility = $('#ftx_S_facility').val();
	// 		var ward = $('#ftx_S_ward').val();

	// 		$("#gridGrid").remove();         
	// 		// $('#divGrid').html('<table id="divTable"></table><div id="divPager"></div>');
	// 		url = '/patients_search?firstname='+firstname+'&lastname='+lastname+'&number='+number+'&facility='+facility+'&ward='+ward+''
	// 		refreshgrid(url);
	// });

	$('#bDelete').click(function(){
		if(confirm("Are you sure you want to delete this patient")){
			ajax_call('/patients/'+ID+'', 'DELETE');	
		} else {
			return true;
		};
		
	});

	$('#bBack').click(function(){
		$('#divPatientAsideRt, #bEdit, #bNew, #bDelete, #bBack').hide();
		clearFields();
	});

	

	//*****************************************************
	//FUNCTIONS CALLED FROM ABOVE
	function refreshgrid(url){
		// var ward = $('#select_ward').val();
		if (url == 'nil') {url = '/patients'};

		
		//Create Table and Div for grid and navigation "pager" 
	 	// $("#gridWork").remove();         
		$('#divGrid').html('<table id="divTable" style="background-color:#E0E0E0"></table><div id="divPager"></div>');
		//Define grid
		$("#divTable").jqGrid({
			url: url,
			// url: "/inpatients",
			// url: "/inpatients_search?diagnosis=Schizophrenia",
			// url: "/inpatients?_search=true&diagnosis=Schizophrenia",
			//url: '/select_grid?ward='+ward+'',
			datatype:"json",
			mtype:"GET",
			colNames:["id","FirstName","LastName","C #","Facility", "Ward"],
			colModel:[
				{name:"id",index:"id",width:55, hidden:true},
				{name:"firstname",index:"firstname",width:150,align:"center"},
				{name:"lastname",index:"lastname",width:150,align:"center",editable:true},
				{name:"number",index:"number",width:100,align:"center"},
				{name:"facility",index:"facility",width:100,align:"center"},
				{name:"ward",index:"ward",width:150,align:"center"}
			],
			editurl:"/patient/update",
			pager:"#divPager",
			height:390,
			width: 700,
			altRows: true,
			rowNum:15,
			rowList:[15,25,40],
			sortname:"firstname",
			sortorder:"asc",
			viewrecords:true,
			gridview: true, //increased speed can't use treeGrid, subGrid, afterInsertRow
			// loadonce: true,  //grid load data only once. datatype set to 'local'. Futher manip on client. 'Pager' functions disabled
			caption:"Patients ",

		        loadComplete: function(){
		        	// alert('in loadComplete')
		        },

				onSelectRow:function(id) { 
					set_id(id);  //set the ID variable
					data_for_params = {patient: {id: id}}

					$.ajax({ 
							  // url: '/inpatient_show',
							  url: '/patients/'+id+'',
							  data: data_for_params,
							  //type: 'POST',
							  type: 'GET',
							  dataType: 'json'
						}).done(function(data){
							clearFields();
							$('#divPatientAsideRt, #bEdit, #bDelete, #bBack').show();
							$('#bNew').hide();
							$('#id').val(data.id);
							$('#firstname').val(data.firstname);
							$('#lastname').val(data.lastname);
							$('#number').val(data.number);
							$('#facility').val(data.facility);
							$('#ward').val(data.ward);

													  
						}).fail(function(){
							alert('Error in: /inpatient');
						});
				},

				loadError: function (jqXHR, textStatus, errorThrown) {
			        alert('HTTP status code: ' + jqXHR.status + '\n' +
			              'textStatus: ' + textStatus + '\n' +
			              'errorThrown: ' + errorThrown);
			        alert('HTTP message body (jqXHR.responseText): ' + '\n' + jqXHR.responseText);
			    },

			    //The JASON reader. This defines what the JSON data returned should look 
				    //This is the default. Not needed - only if return does NOT look like this
					// jsonReader: { 
					// 	root: "rows", 
					// 	page: "page", 
					// 	total: "total", 
					// 	records: "records", 
					// 	repeatitems: true, 
					// 	cell: "cell", 
					// 	id: "id",
					// 	userdata: "userdata",
					// 	subgrid: { 
					// 	 root:"rows", 
					// 	 repeatitems: true, 
					// 	 cell:"cell" 
					// 	} 
					// },	

		})
		.navGrid('#divPager', 
			{edit:false,add:false,del:false,search:false,refresh:false}
			// {edit:false,add:false,del:true,search:false,refresh:false}
			// {"del":true}, 
			// {"closeAfterEdit":true,"closeOnEscape":true}, 
			// {}, {}, {}, {}
	 	  )
		.navButtonAdd('#divPager', {
			caption: 'New',
			buttonicon: '',
			onClickButton: function(){
				clearFields();
				$('#divPatientAsideRt, #bNew, #bBack').show();
				$('#bDelete, #bEdit').hide();
			},
			position:'last'
		});
	};


	function clearFields(){
		$('#firstname, #lastname, #number, #facility, #ward').val('');
	 };


	$('#ftx_S_facility').click(function(){
		$('#slt_s_ward').mjm_addOptions('ward',{firstLine: 'All Wards', group: true});
	});

	function ajax_call (url, type) {
		var firstname = $('#firstname').val();
		var lastname = $('#lastname').val();
		var number = $('#number').val();
		var facility = $('#facility').val();
		var ward = $('#ward').val();
		// Create strong parameter
		data_for_params ={patient: {'firstname': firstname, 'lastname': 
						lastname, 'number': number, 
				  	    'facility': facility, 'ward': ward}}

		//VALIDATION
			if (lastname == '') {
				alert('Please enter a Last Name');
				return false;
			};

		$.ajax({
			url: url,
			type: type,
			data: data_for_params,
			dataType: 'json'
		}).done(function(data){
			refreshgrid('nil');
			clearFields();
			$('#divPatientAsideRt, #bEdit, #bNew, #bDelete, #bBack').hide();

		}).fail(function(){
			alert('Error in invoicenew');
		});
	};

};   //if ($('body.patients').length) {
});  //$(document).on("ready page:change", function(){ 
