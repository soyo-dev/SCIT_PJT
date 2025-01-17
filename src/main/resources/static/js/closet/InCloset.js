/**
 * 옷장 페이지
 */
$(document).ready(function(){
	const ps = new PerfectScrollbar('#whatsInCloset');
	closetNum = parseInt(closetNum); // 스트링에서 정수형으로 변환
	let laundryCheck = false;
	$('#webSearchbtn').on('click',webSearch);
	
	
// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	let dataValue = new Array(8);
	$.ajax({
		url:'chartValue',
		type:'get',
		data:{closetNum: closetNum, laundryCheck:laundryCheck},
		dataType:'json',
		success:function(valueList){
			console.log(valueList);
			console.log(typeof(valueList));
			console.log(valueList.ACCESSORYCATEGORYCOUNT);
			dataValue[0] = valueList.TOPCATEGORYCOUNT;
			dataValue[1] = valueList.BOTTOMCATEGORYCOUNT;
			dataValue[2] = valueList.OUTERCATEGORYCOUNT;
			dataValue[3] = valueList.DRESSCATEGORYCOUNT;
			dataValue[4] = valueList.SHOESCATEGORYCOUNT;
			dataValue[5] = valueList.BAGCATEGORYCOUNT;
			dataValue[6] = valueList.ACCESSORYCATEGORYCOUNT;
			dataValue[7] = valueList.ETCCATEGORYCOUNT;
			
			chartDraw(dataValue);
		},
		error:function(e){
			console.log(JSON.stringify(e));
		}			
	})	
// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	



//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
		//옷찾기 분류에서 소분류 숨겨놓기
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();
		//옷찾기에서 신발사이즈 숨겨놓기
		$('#shoesSizeForSearch').hide();
		//옷찾기에서 분류를 선택하면 clothesSearchAnimation함수 실행	
		$("#clothesCategoryForSearch").on('change',clothesSearchAnimation);
		$("#clothesSearchbtn").on('click',clothesSearch); //옷찾기 버튼 클릭하면 clothesSearch 함수실행
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		


		//(의류)등록버튼을 클릭하면 insertClothes함수 실행
		$('#insertClothesbtn').on('click', insertClothes);

		//편집버튼 누르면 editIMG함수 실행
		$('#editIMGbtn').on('click', editIMG);
		

// !!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$.ajax({
			url:'inCloset',
			type:'get',
			data:{closetNum: closetNum},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str +='<div class="clothesList">\
							<a onclick="readClothes('+n.closetNum+','+clothesNum+')">\
							<img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">\
							</a></div>';
				});
				if(str == ''){
					$('#whatsInCloset').html('<p style="font-size:2rem;">옷장에 옷이 없습니다. <br> 옷을 추가해주세요.</p>')
				}else{
				$('#whatsInCloset').html(str);
				}
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})		
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		//카테고리에서 신발종류를 선택하지않으면, 신발사이즈는 보이지않게 숨기기
		$('#shoesSize').hide(); 
		//카테고리에서 신발종류를 선택하면 옷사이즈 사라지고 신발사이즈가 보임
		$('#clothesCategory').change(function(){
			var result = $('#clothesCategory option:selected').val();
			if (result == 'sneakers' || result == 'formalShoes' || result == 'boots' || result == 'sandals'){
				$('#clothesSize').hide();
				$('#shoesSize').show();
			} else {
				$('#clothesSize').show();
				$('#shoesSize').hide();
			}
		}) 
		
		//카테고리에서 신발종류를 선택하지않으면, 신발사이즈는 보이지않게 숨기기
		$('#updateShoesSize').hide(); 
		//카테고리에서 신발종류를 선택하면 옷사이즈 사라지고 신발사이즈가 보임
		$('#updateclothesCategory').change(function(){
			var result = $('#updateclothesCategory option:selected').val();
			if (result == 'sneakers' || result == 'formalShoes' || result == 'boots' || result == 'sandals'){
				$('#updateClothesSize').hide();
				$('#updateShoesSize').show();
			} else {
				$('#updateClothesSize').show();
				$('#updateShoesSize').hide();
			}
		}) 
		
		
		const imageInput = document.getElementById("uploadIMG"); //input file태그 의류사진 등록버튼
		const imagePreview = document.getElementById("imagePreview"); //첨부한 사진 미리보기 div영역
		//사진등록 버튼을 클릭해서 이미지 첨부하면, 미리보기가 실행됨
		imageInput.addEventListener("change", function() {
		  const selectedFile = imageInput.files[0];
		  if (selectedFile) {
		    const reader = new FileReader();

		    reader.onload = function(event) {
		      const imageUrl = event.target.result;
		      const imageElement = document.createElement("img");
		      imageElement.setAttribute("src", imageUrl);
		      imageElement.setAttribute("alt", "Image Preview");
		      imageElement.setAttribute("style", "max-width: 100%; max-height: 300px;");
		      
		      imagePreview.innerHTML = "";
		      imagePreview.appendChild(imageElement);
		    }

		    reader.readAsDataURL(selectedFile);
		  } 
		});
		
		
	});//document.ready 끝
	

function chartDraw(dataValue){
	
  let chartdata = {
  	labels: ['상의','하의','아우터','원피스','신발','가방','악세사리','기타'],
  	datasets: [{
    			label: '개수',
    			data: dataValue,
    			backgroundColor: [
					'rgb(244, 67, 54)',
					'rgb(255, 111, 0)',
					'rgb(255, 241, 118)',
					'rgb(220, 231, 117)',
      				'rgb(54, 162, 235)',
      				'rgb(186, 104, 200)',
      				'rgb(255, 99, 132)',
      				'rgb(255, 205, 210)',
    				],
    			hoverOffset: 4
  				}]//datasets
	};//let chartdata	 
	 
	let context = document.getElementById('myChart').getContext('2d');
 	window.myChart = new Chart(context, {
   			type: 'doughnut',
    		data: chartdata,
			options: {
			responsive: false,
  	  		plugins: {
    		title: {
        		display: true,
        		text: '현재 옷장',
      				}
    			}//plugins
  	  		}//options 
  		});//new Chart 
 }//function chartDraw


	//사진 편집여부 체크하는 변수
	let imgEditCheck = 0;
	
	// editIMGbtn 누르면 실행되는 함수: 사진편집+미리보기 기능
	function editIMG(){
		const imageElement = document.getElementById("preview");
		let imageFromStore;
		let imageUrl;
		if(imageElement){ // id가 preview 이미지 요소
			let imageSrc = imageElement.src; //이미지 요소 src속성 읽어오기
			imageFromStore = imageSrc.substr(22,41);
			imageUrl = imageSrc.substr(84);
		}
		const imageInput = document.getElementById("uploadIMG");
		const selectedFile = imageInput.files[0];
		
		//이미지가 웹에서 찾은 경우가 아닐경우 && 사진파일 등록 안했을 경우
		if (imageFromStore != "secretary/closet/clothesFromStoreDownload" && !selectedFile) {
			alert("사진을 등록해주세요");
			return;
		}

        const formData = new FormData();
        formData.append('image', selectedFile);
        if(imageFromStore === "secretary/closet/clothesFromStoreDownload"){
       		formData.append('fromStore', imageUrl);
       	} else {
			formData.append('fromStore', 'NoFromStore');   
		}
        //서버에 사진편집 요청보내기
        fetch('processImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const image = new Image();
            image.src = URL.createObjectURL(blob);
            imagePreview.innerHTML = "";
            imagePreview.appendChild(image);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        imgEditCheck = 1; //사진편집여부 체크
	}
	

	//(의류)등록 insertClothesbtn 누르면 실행되는 함수 
	function insertClothes(){
		const imageElement = document.getElementById("preview");
		let imageFromStore;
		let imageUrl;
		if(imageElement){ // id가 preview 이미지 요소
			let imageSrc = imageElement.src; //이미지 요소 src속성 읽어오기
			imageFromStore = imageSrc.substr(22,41);
			imageUrl = imageSrc.substr(84);
		}
		
		//웹에서 찾은 경우가 아닐경우 && 사진파일 등록 안했을 경우
		if (!imgEditCheck && imageFromStore != "secretary/closet/clothesFromStoreDownload" && !document.getElementById("uploadIMG").files[0]){
			alert("사진을 등록해주세요");
			return;			
		}
		
		let originalFileName;
		let blobIMG;//uploadFile 값으로 사용할 변수
		let fromStoreCheck = '해당없음';
		if(!imgEditCheck && document.getElementById("uploadIMG").files[0]){
			//편집X , 직접 등록한 파일
			blobIMG = document.getElementById("uploadIMG").files[0];
			originalFileName = document.getElementById("uploadIMG").files[0].name; //사용자가 첨부한 파일이름, clothesOriginalFile의 값
		} else if(imgEditCheck && document.getElementById("uploadIMG").files[0]){
			//편집O, 직접 등록한 파일
			originalFileName = document.getElementById("uploadIMG").files[0].name;
		} else if(!imgEditCheck && !document.getElementById("uploadIMG").files[0]){
			//편집X, 웹에서 찾은 이미지
			originalFileName = imageUrl;
			fromStoreCheck = imageUrl;
		} else if(imgEditCheck && !document.getElementById("uploadIMG").files[0]){
			originalFileName = imageUrl; //현재 의류 추가하면 undefined 됨 -> 컨트롤러에서 바꿔주기
			fromStoreCheck = imageUrl;
		}
		
		let category = $('#clothesCategory option:selected').val(); //분류
		let material = $('#materialList option:selected').val();	//소재
		//계절 배열변수에 담기
		const seasonArr = [];
		var seasonChecked = $("input:checkbox[name='seasons']:checked");
		$(seasonChecked).each(function(){
			seasonArr.push($(this).val());
		}); 
		if(seasonArr.length == 0){
			seasonArr.push("해당없음");
		}
		
		//옷이면 옷사이즈, 신발이면 신발사이즈 가져오기
		let size;
		var result = $('#clothesCategory option:selected').val();
		if (!(result == 'sneakers') && !(result == 'formalShoes') && !(result == 'boots') && !(result == 'sandals')){
			size = 	$("select[name='clothesSize'] option:selected").val();
		} else {
			size = $("input[name='shoesSize']").val();
		}
		
		closetNum = parseInt(closetNum);// 스트링에서 정수형으로 변환
		familyId = parseInt(familyId);// 스트링에서 정수형으로 변환
		//폼데이터에 넣을 key-value값들
		const clothesObj = {
			familyId : familyId,
			closetNum : closetNum,
			clothesMaterial : material,
			clothesCategory	: category,
			clothesSeasons : seasonArr,
			clothesSize : size,
			clothesOriginalFile : originalFileName,
			uploadFile : blobIMG,
			clothesEditcheck : imgEditCheck,
			fromStoreCheck :fromStoreCheck,
		}		
		let formData = new FormData();
		for (let key in clothesObj){//for문으로 폼데이터에 값 전달
			formData.append(key, clothesObj[key])			
		}
		let entries = formData.entries();
		for (const pair of entries) {//formData값 콘솔로 확인
		    console.log(pair[0]+ ', ' + pair[1]); 
		}
		
		//fetch로 서버에 의류등록 요청보내기
		fetch('insertClothes',{
			method:'POST',
			body: formData
		})
		.then(response => response.json())
        .then(data => {
        	
        })
        .catch(error => {
            console.error('Error:', error);
        });  
		
		//옷등록 완료했으면 새로고침
		location.reload(true);

	}
	
	
	function clothesSearch(){
		//console.log();
		// 카테고리 category, 사이즈 size
		let category = $('#clothesCategoryForSearch option:selected').val();
		let size;				
		if(category == 'top'){
			category = $('#topCategory option:selected').val();
		} else if(category == 'bottom'){
			category = $('#bottomCategory option:selected').val();
		} else if(category == 'clothesOuter'){
			category = $('#outerCategory option:selected').val();
		} else if(category == 'dress'){
			category = $('#dressCategory option:selected').val();
		} else if(category == 'shoes'){
			//신발사이즈 체크된 값
			size = $("input:checkbox[name='shoesSizeAll']:checked").val();
			if(size==undefined){
				size = $("input[name='shoesForSearch']").val();
			}
			category = $('#shoesCategory option:selected').val();
		} else if(category == 'bag'){
			category = $('#bagCategory option:selected').val();
		} else if(category == 'accessory'){
			category = $('#accessoryCategory option:selected').val();
		} else if(category == 'etc'){
			category = $('#etcCategory option:selected').val();
		}
		//신발이 아닌경우
		if(size==undefined){
				size = $('#clothesSizeForSearch option:selected').val();
		}	 
		console.log(category);
		console.log(size);
		
		// 소재 material
		let material = $('#materialListForSearch option:selected').val();
		console.log(material);

		// 계절 seasonArr
		const seasonArr = [];
		var seasonChecked = $("input:checkbox[name='seasonsForSearch']:checked");
		$(seasonChecked).each(function(){
			seasonArr.push($(this).val());
		}); 		
		console.log(seasonArr);
		console.log(typeof(seasonArr));
		
		closetNum = parseInt(closetNum); // 스트링에서 정수형으로 변환
		$.ajax({
			url:'inCloset',
			type:'get',
			traditional:true,
			data:{closetNum: closetNum, category:category, size:size
				,seasonArr: seasonArr, material:material},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str += '<div class="clothesList"><a onclick="readClothes('+n.closetNum+','+clothesNum+')"><img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'"></div>';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
	}
	
	
	//의류 자세히보기
	function readClothes(closetNum, clothesNum){
		console.log(closetNum);
		console.log(clothesNum);
		$.ajax({
			url:'readClothes',
			type:'get',
			data:{closetNum: closetNum, clothesNum: clothesNum},
			dataType:'json',
			success:function(clothes){
				//분류, 소재, 계절, 관리방법 한글로 변환작업
				const translatedCategory = categoryMapping[clothes.clothesCategory] || clothes.clothesCategory;
				const translatedMaterial = materialMapping[clothes.clothesMaterial] || clothes.clothesMaterial;
				const manageTip = howtomanageMapping[clothes.clothesMaterial] || clothes.clothesMaterial;
				let seasonresult = '';
				if(!clothes.clothesSeasons){
					seasonresult='해당 없음';
				} else if(clothes.clothesSeasons.includes(',')){
					let inputSeasonArray = clothes.clothesSeasons.split(',').map(season => season.trim());
					// 매핑된 결과를 담을 배열
					let translatedSeasons = [];

					// 각 사계절을 매핑하고 결과를 배열에 추가합니다.
					inputSeasonArray.forEach(inputSeason => {
   					 let translatedSeason = seasonMapping[inputSeason] || inputSeason;
    				translatedSeasons.push(translatedSeason);
					});
					seasonresult = translatedSeasons.join(', ');
				} else {
					//쉼표 없이 계절 하나일 경우
					seasonresult = seasonMapping[clothes.clothesSeasons] || clothes.clothesSeasons;
				}
				
				let imgStr =  '<img	src="../closet/clothesDownload?closetNum='+clothes.closetNum+'&clothesNum='+clothes.clothesNum+'">'
				let str = '<br><br><ul>\
							<li><button class="btn-pink" style="cursor:auto;">카테고리</button><li>\
							<li>&nbsp;&nbsp;'+translatedCategory+'</li>\
							<li>&nbsp;&nbsp;'+ translatedMaterial+'</li>\
							<li>&nbsp;&nbsp;'+seasonresult+'</td>\
							<li>&nbsp;&nbsp;'+clothes.clothesSize+'</li></ul>\
							<br><ul><li><button class="btn-pink" style="cursor:auto;">착용횟수</button></li>\
							<li>&nbsp;&nbsp;'+clothes.clothesPutOnCnt+'번</li></ul><br>\
							<ul><li><button class="btn-pink" style="cursor:auto;">관리방법</button>&nbsp;&nbsp;'+manageTip+'</li></ui><br>'
				let footer = '<br><div id="clothesFooter"><button class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);"\
								onclick="laundryIn('+clothes.closetNum+','+clothes.clothesNum+')">세탁물 체크</button>\
							&nbsp;&nbsp;<button type="button" class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255); float:right;" \
								onclick="deleteClothes('+clothesNum+')"> 삭제 </button>\
							&nbsp;&nbsp;<button type="button" class="btn btn-primary"	style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255); margin-right:0.5rem; float:right" \
								onclick="openUpdateModal('+clothes.clothesNum+')"> 수정 </button></div>'
							
				$('#IMGdetail').html(imgStr+str+footer);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		}) //의류정보 읽어오기
		
	}
	
	//의류 수정 모달창 열기 + 의류 수정
	function openUpdateModal(clothesNum) {
		closetNum = parseInt(closetNum);
   	 	/*let clothesNumForUpdateInput = document.getElementById('clothesNumForUpdate');
    	clothesNumForUpdateInput.value = clothesNum; //의류번호 가져오기 */

    	// 모달 열기
   		 const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    		updateModal.show();
    	
    	//현재 의류사진 미리보기창에 보여주기
    	/*let clothesNumForUpdate = $('#clothesNumForUpdate').val();*/
		let previewStr = '<img src="../closet/clothesDownload?closetNum='+closetNum+'&clothesNum='+clothesNum+'">';
		$('#updatePreview').html(previewStr);
		
		//사진등록하면 미리보기 창에 보여주기 
		let updateImageInput = document.getElementById("updateIMG");
		let updateImagePreview = document.getElementById("updatePreview");
		updateImageInput.addEventListener("change", function(){
			console.log('num:'+clothesNum);
			let selectedFile = updateImageInput.files[0];
		  	if (selectedFile) {
		    const updateReader = new FileReader();

		    updateReader.onload = function(event) {
		      const updateImageUrl = event.target.result;
		      const updateImageElement = document.createElement("img");
		      updateImageElement.setAttribute("src", updateImageUrl);
		      updateImageElement.setAttribute("alt", "Image Preview");
		      updateImageElement.setAttribute("style", "max-width: 100%; max-height: 300px;");
		      
		      updateImagePreview.innerHTML = "";
		      updateImagePreview.appendChild(updateImageElement);
		    }

		    updateReader.readAsDataURL(selectedFile);
		  } 
		});	//사진등록 미리보기 끝
		
		//업데이트할 사진 편집기능
		let updateEditCheck = 0;
		$('#updateEditIMGbtn').on('click', function(){
			const imageElementForUpdate = document.getElementById("previewForUpdate");
			let imageFromStore;
			let imageUrl;
			if(imageElementForUpdate){
				let imageSrc = imageElementForUpdate.src; //이미지 요소 src속성 읽어오기
				imageFromStore = imageSrc.substr(22,41);
				imageUrl = imageSrc.substr(84);
			}			
			const updateImageInput = document.getElementById("updateIMG");
			const updateSelectedFile = updateImageInput.files[0];
			if (imageFromStore != "secretary/closet/clothesFromStoreDownload" && !updateSelectedFile) {
				alert("사진을 등록해주세요");
				return;
			}
       		 const updateFormData = new FormData();
       		 updateFormData.append('image', updateSelectedFile);
          	 if(imageFromStore === "secretary/closet/clothesFromStoreDownload"){
       			updateFormData.append('fromStore', imageUrl);
       		} else {
				updateFormData.append('fromStore', 'NoFromStore');   
			}   	
        		//서버에 사진편집 요청보내기
        		fetch('processImage', {
         		   method: 'POST',
        		   body: updateFormData
       			 })
       			 .then(response => response.blob())
       			 .then(blob => {
        		    const updatedImage = new Image();
            		updatedImage.src = URL.createObjectURL(blob);
           			updatePreview.innerHTML = "";
           			updatePreview.appendChild(updatedImage);
      			  })
      			  .catch(error => {
        			    console.error('Error:', error);
       			 });
        
       		 updateEditCheck = 1; //사진편집여부 체크
			
		}); //업데이트할 사진 편집기능 끝
		
		//데이터 입력후 의류 수정 요청
		$('#updateClothesbtn').on('click', function(){
		const imageElementForUpdate = document.getElementById("previewForUpdate");
		let imageFromStore;
		let imageUrl;
		if(imageElementForUpdate){ // id가 preview 이미지 요소
			let imageSrc = imageElementForUpdate.src; //이미지 요소 src속성 읽어오기
			imageFromStore = imageSrc.substr(22,41);
			imageUrl = imageSrc.substr(84);
		}
				
		let blobIMG;//uploadFile 값으로 사용할 변수
		let originalFileName;
		let fromStoreCheck = '해당없음';
		if(!document.getElementById("updateIMG").files[0] && !updateEditCheck && imageFromStore === "secretary/closet/clothesFromStoreDownload"){
			// 사진등록 X, 편집X, 웹에서 찾기O
			originalFileName = imageUrl;
			fromStoreCheck = imageUrl;
		} else if(!document.getElementById("updateIMG").files[0] && updateEditCheck){
			// 사진등록 X, 편집O -> 웹에서 찾은 사진 편집했을때
			fromStoreCheck = imageUrl;
		} else if(document.getElementById("updateIMG").files[0] && !updateEditCheck){
			// 사진등록 O, 편집X !!
			blobIMG = document.getElementById("updateIMG").files[0];
			originalFileName = document.getElementById("updateIMG").files[0].name;
		} else if(document.getElementById("updateIMG").files[0] && updateEditCheck){
			// 사진등록 O, 편집O
			originalFileName = document.getElementById("updateIMG").files[0].name;
		}
		
		
		let category = $('#updateclothesCategory option:selected').val(); //분류
		let material = $('#updateMaterialList option:selected').val();	//소재

		//계절 배열변수에 담기
		const updateSeasonArr = [];
		var seasonChecked = $("input:checkbox[name='updateSeasons']:checked");
		$(seasonChecked).each(function(){
			updateSeasonArr.push($(this).val());
		});
		if(updateSeasonArr.length == 0){
			updateSeasonArr.push("해당없음");
		}
		
		
		//옷이면 옷사이즈, 신발이면 신발사이즈 가져오기
		let size;
		var result = $('#updateclothesCategory option:selected').val();
		if (!(result == 'sneakers') && !(result == 'formalShoes') && !(result == 'boots') && !(result == 'sandals')){
			size = 	$("select[name='updateClothesSize'] option:selected").val();
		} else {
			size = $("input[name='updateShoesSize']").val();
		}
		
		//폼데이터에 넣을 key-value값들
		const updateClothesObj = {
			closetNum : closetNum,
			clothesNum : clothesNum,
			clothesMaterial : material,
			clothesCategory	: category,
			clothesSeasons : updateSeasonArr,
			clothesSize : size,
			clothesOriginalFile : originalFileName,
			uploadFile : blobIMG,
			clothesEditcheck : updateEditCheck,
			fromStoreCheck: fromStoreCheck,
		}
		
		let formData = new FormData();
		for (let key in updateClothesObj){//for문으로 폼데이터에 값 전달
			formData.append(key, updateClothesObj[key])			
		}
		
		let entries = formData.entries();
		for (const updatePair of entries) {//formData값 콘솔로 확인
		    console.log(updatePair[0]+ ', ' + updatePair[1]); 
		}
		
		//fetch로 서버에 의류등록 요청보내기
		fetch('updateClothes',{
			method:'POST',
			body: formData
		})
		.then(response => response.json())
        .then(data => {
        	console.log('변경했음');
        })
        .catch(error => {
            console.log('Error');
        });  
		
		//옷수정 완료했으면 새로고침
		location.reload(true);

					
		});
	
	
	}
	
	
	function deleteClothes(clothesNum){
		closetNum = parseInt(closetNum);
		let res = confirm('정말로 삭제하시겠어요?');
		if(res){
			$.ajax({
				url:'deleteClothes',
				type:'get',
				data:{closetNum: closetNum, clothesNum:clothesNum},
				success:function(){
					location.reload(true); //새로고침					
				},
				error:function(e){
					alert(JSON.stringify(e));
				}						
			})
		}//if문
	}
	
	//의류 세탁물 체크
	function laundryIn(closetNum, clothesNum){
		$.ajax({
			url:'laundryIn',
			type:'get',
			data:{closetNum: closetNum, clothesNum:clothesNum},
			success:function(){
				location.reload(true);				
			},
			error:function(e){
				alert(JSON.stringify(e));
			}						
		})		
	}
	


	function webSearch(){
		var page = window.open("webSearch", "webSearhPage");
	}
	
    function receiveImage(imageUrl) {
		let ImgSrc = '<img id="preview" src="../closet/clothesFromStoreDownload?clothesFromStoreImg='+imageUrl+'">';
		$('#imagePreview').html(ImgSrc);
    }
    
    function receiveImageForUpdate(imageUrl) {
		let ImgSrc = '<img id="previewForUpdate" src="../closet/clothesFromStoreDownload?clothesFromStoreImg='+imageUrl+'">';
		$('#updatePreview').html(ImgSrc);
    }

	const howtomanageMapping = {
    'none': '해당 없음', 'cotton': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 밝은 색과 진한 색을 분리하여 세탁합니다. 햇빛에 오래 노출하지 않고, 그늘에서 보관하며 공기 순환을 유지합니다.', 
    'linen': '손세탁이나 기계 세탁 모두 가능하며, 따뜻한 물을 사용합니다. 세탁 시 드라이어 사용을 피하고, 그늘에서 건조합니다. 린넨은 다림질 시 미지근한 상태에서 다림질해야 합니다.',
    'polyester': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질이 필요할 경우 낮은 열로 다림질합니다.', 
    'denim': '데님은 기계 세탁이 가능하며, 내부를 바깥으로 뒤집어서 세탁합니다. 드라이어 사용을 피하고, 건조할 때 태양에 직사광선을 피합니다. 다림질은 필요하지 않습니다.',
    'knit': '손세탁이나 기계 세탁 중 선택할 수 있으며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 수평으로 뉘어뜨려서 건조합니다. 낮은 열로 뒤집어서 다림질합니다.',
    'wool': '손세탁을 권장하며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 수평으로 뉘어뜨려서 건조합니다. 낮은 열로 다림질하며, 스팀 다림질이 필요할 수 있습니다.',
    'acryl': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.', 
    'corduroy': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피하고, 건조할 때 털을 다듬어 줍니다. 다림질 시 낮은 열로 다림질합니다.',
    'silk': '손세탁을 권장하며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 그늘에서 건조합니다. 다림질 시 낮은 열로 다림질하며, 실크 제품을 뒤집어서 다림질합니다.',
    'woolen': '드라이클리닝을 권장하며, 손세탁 시 차가운 물을 사용합니다. 드라이어 사용을 피하고, 건조할 때 털을 다듬어 줍니다. 낮은 열로 뒤집어서 다림질합니다.',
    'nylon': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.', 
    'suede': '스웨이드는 물과 습기에 민감하므로, 특수한 스웨이드 브러시를 사용하여 세탁합니다.',
    'leather': '가죽 제품은 특수한 관리가 필요하므로 전문적인 가죽 청소제와 관리제를 사용합니다. 습기와 물을 피하고, 직사광선에 노출을 피합니다.', 
    'rayon': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피합니다. 다림질 시 낮은 열로 다림질합니다.', 
    'oxford': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피합니다. 다림질 시 낮은 열로 다림질합니다.',
    'napping': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.'		
	}
	
	const categoryMapping = {
    'Tshirt': '티셔츠', 'blouse': '블라우스/셔츠', 'sweatshirt': '맨투맨/후디', 'knitwear': '니트',
    'skirt': '치마', 'pants': '바지', 'jeans': '청바지', 'trainingPants': '트레이닝/조거',
    'coat': '코트', 'jacket': '자켓/점퍼', 'paddedJacket': '패딩', 'zipupHoodie': '후드집업', 'cardigan': '가디건/베스트',
    'miniDress': '미니원피스', 'longDress': '롱원피스',
    'sneakers': '운동화', 'formalShoes': '구두', 'boots': '부츠', 'sandals': '샌들',
    'backpack': '백팩', 'totebag': '숄더/토트백', 'crossbodybag': '크로스백', 'clutchbag': '클러치',
    'hat': '모자', 'socks': '양말', 'jewelryOrWatch': '쥬얼리/시계', 'scarf': '머플러/스카프', 'belt': '벨트', 'accessoryEtc': '기타',
    'innerwear': '이너웨어', 'sleepwear': '잠옷', 'swimsuit': '수영복'
	};
	
	const materialMapping = {
    'none': '해당없음', 'cotton': '면', 'linen': '린넨',
    'polyester': '폴리에스테르', 'denim': '데님', 'knit': '니트',
    'wool': '울', 'acryl': '아크릴', 'corduroy': '코듀로이',
    'silk': '실크', 'woolen': '모직', 'nylon': '나일론', 'suede': '스웨이드',
    'leather': '가죽', 'rayon': '레이온', 'oxford': '옥스퍼드',
    'napping': '기모'
	};
	
	const seasonMapping = {
    'spring': '봄', 'summer': '여름', 'fall': '가을','winter': '겨울'
	};
	
// !!!!!!!!!!!!!!!!!!!!!!!!! 옷 검색 애니메이션 효과 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	function clothesSearchAnimation(){
		var result = $('#clothesCategoryForSearch option:selected').val();
		if(result=='top'){
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();
			$('#topCategory').show();
		}else if(result =='bottom'){
			$('#topCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();			
			$('#bottomCategory').show();
		}else if(result =='clothesOuter'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();			
			$('#outerCategory').show();
		}else if(result =='dress'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();			
			$('#dressCategory').show();
		}else if(result =='shoes'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();
			$('#clothesSizeForSearch').hide();
			
			$('#shoesSizeForSearch').show();
			$('#shoesCategory').show();
		}else if(result =='bag'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();	
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();					
			$('#bagCategory').show();
		}else if(result =='accessory'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#etcCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();			
			$('#accessoryCategory').show();
		}else if(result =='etc'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();			
			$('#etcCategory').show();			
		}else if(result== 'CategoryAll'){
			$('#topCategory').hide();
			$('#bottomCategory').hide();
			$('#outerCategory').hide();
			$('#dressCategory').hide();
			$('#shoesCategory').hide();
			$('#bagCategory').hide();
			$('#accessoryCategory').hide();
			$('#etcCategory').hide();		
			$('#shoesSizeForSearch').hide();
			
			$('#clothesSizeForSearch').show();				
		}
	}