/*budget controller module:
This is a IIFE function that also involve clousers
modules are created because we want to keep the varisbles and methods of a particular module safe
unaccessed from the other modules.
*/
var budgetController=(function(){
    
    var expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }
    };

    expense.prototype.getPercentage=function(){
        return  this.percentage;
    }

    var income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    };

    var calculateTotal= function(type){
        var sum=0;
        data.allitems[type].forEach(function(cur){
            sum = sum+cur.value;
        });
        data.totals[type]=sum;
    };

    var data={
        allitems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:-1
    };


    return {
        additem: function(type,des,val){
            var newItem,ID;
            
            //ID=lastID+1
            //create new ID
            if(data.allitems[type].length>0){
                ID=data.allitems[type][data.allitems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            

            //create new items based on inc nad exp
            if(type==='exp'){
                newItem=new expense(ID,des,val);
            }
            else if(type==='inc'){
                newItem=new income(ID,des,val);
            }

            //push it to our datastructure
            data.allitems[type].push(newItem);

            // return the new element
            return newItem;

        },

        deleteItem:function(type, id){
            var ids,index;
            //ids=[1,2,4,5,6]
            ids=data.allitems[type].map(function(current){
                return current.id;
            });

            index=ids.indexOf(id);

            if(index!== -1){
                data.allitems[type].splice(index,1);
            }

        },

        calculateBudget:function(){

            // calculating income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the bidget: income - expenses
            data.budget=data.totals.inc-data.totals.exp;

            // calculate the % of income that we spent
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
            
        },

        calculatePercentages: function(){

            data.allitems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });

        },

        getPercentages:function(){
            var allPerc=data.allitems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage: data.percentage
            }
        },

        testing:function(){
            console.log(data);
        }
    };


})();

/*
user interface controller module:

 */

 var UIcontroller=(function(){


    var DOMstrings={
        inputType:".add__type",
        inputDescription:".add__description",
        inputValue:".add__value",
        inputBtn:".add__btn",
        incomeContainer:".income__list",
        expensesContainer:".expenses__list",
        budgetLabel:".budget__value",
        incomeLabel:".budget__income--value",
        expensesLabel:".budget__expenses--value",
        percentageLabel:".budget__expenses--percentage",
        container:".container",
        expensesPercLabel:".item__percentage",
        dateLabel:".budget__title--month",
        deleteBtn:".bottom-2"
    };

    var formatNumber=function(num/*,type*/){
        /*
        var numSplit,int,dec;
        //convert a number into two decimal places
        num=Math.abs(num);
        num=num.toFixed(2);
        numSplit=num.split(".");
        int = numSplit[0];
        if(int.length){
            int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);//

        }

        dec=numSplit[1];

        return (type==='exp'?'-':'+')+' '+int+dec;*/
        return num.toFixed(2);


    };

    var nodeListForEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    };


    return {
        getinput: function(){

            return{
                type : document.querySelector(DOMstrings.inputType).value,//will be + or -
                description:document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat( document.querySelector(DOMstrings.inputValue).value)
            };
            
        },

        addListItem:function(obj,type){
            var html,newhtml,element;

            // create HTML string with place holder text
            if(type==='inc'){
                element=DOMstrings.incomeContainer;
                //html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';


                html='<div class="item clearfix row" id="inc-%id%"><div class="item__description col-3">%description%</div><div class="right clearfix col-9 row"><div class="item__value col-8">%value%</div><div class="item__delete col-4"><button class="item__delete--btn"><i class="fas fa-trash-alt"></i></button></div></div></div>';

            }
            else if(type==='exp'){
                element=DOMstrings.expensesContainer;
                //html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                html='<div class="item clearfix row" id="exp-%id%"><div class="item__description col-3">%description%</div><div class="right clearfix col-9"><div class="item__value col-6">%value%</div><div class="item__percentage col-3">21%</div><div class="item__delete col-3"><button class="item__delete--btn"><i class="fas fa-trash-alt"></i></button></div></div></div>';

            }
            //replace the placeholder text with actual data
            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatNumber(obj.value));
            //insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);

        },

        deleteListItems:function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFeilds:function(){
            var feilds,feildsArray;
            feilds=document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            feildsArray=Array.prototype.slice.call(feilds);
            feildsArray.forEach(function(current, index,array) {
                current.value="";
            });

            feildsArray[0].focus();
        },

        displayBudget: function(obj){

            document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc);
            document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp);
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+"%";
                document.querySelector(".bg-danger").style.width=obj.percentage+"%";
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent="--";
                document.querySelector(".bg-danger").style.width=0+"%";
            }

        },

        displayPercentages:function(percentages){

            var feilds= document.querySelectorAll(DOMstrings.expensesPercLabel);

            

            nodeListForEach(feilds,function(current,index){
                if(percentages[index]>0){
                    current.textContent=percentages[index]+"%";
                    //document.querySelector(".progress-bar").style.width=percentages[indes]
                }
                else{
                    current.textContent="--";
                }
                
            });
        },

        displayMonth:function(){
            var now,year,month,day;
            var d = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            var months=['jan','feb','mar','apr','may','june','july','aug','sep','oct','nov','dec'];
            now= new Date();
            day=weekday[now.getDay()];
            month=now.getMonth();
            year=now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent="{"+day+" / "+months[month]+" / "+year+"}";

        },

        changeType:function(){
            var fields=document.querySelectorAll(
                DOMstrings.inputType,+','+
                DOMstrings.inputDescription+','+
                DOMstrings.inputValue);

            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        getDOMstrings : function(){
            return DOMstrings;
        }
    }


 })();

/*
controller module:
*/
var controller=(function(budgetctrl,UIctrl){
    
    var setupEventListners=function(){
        var DOM=UIctrl.getDOMstrings();

        
        // eiter press button or press enter
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        
        document.addEventListener('keypress',function(){
            if(event.keyCode===13 || event.which===13){
                ctrlAddItem();
            }
        
        });

        document.querySelector(DOM.deleteBtn).addEventListener('click',ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change',UIctrl.changeType);
    };


    var updateBudget=function(){
        //5. calculate the budget
        budgetctrl.calculateBudget();

        //6. Returning the budget
        var budget=budgetctrl.getBudget();

        //7. display the budget in the UI
        console.log(budget);
        UIctrl.displayBudget(budget);
    };


    var updatePercentages=function(){

        //1. Calculate percentages
        budgetctrl.calculatePercentages();

        //2. read percentages from the budget controller
        var percentages=budgetctrl.getPercentages();

        //3. update the UI with the new percentages
        UIctrl.displayPercentages(percentages);

    };
    
    var ctrlAddItem=function(){
        var input,newItem;

        //1. get the feild input data
        input=UIctrl.getinput();
        console.log(input);

        if(input.description!== "" && !isNaN(input.value) && input.value>0){
            
            //2. add the items to the budget controller
            newItem=budgetctrl.additem(input.type, input.description , input.value);
            //3. add the items to the UI
            UIctrl.addListItem(newItem, input.type);
            //4. clearing feilds
            UIctrl.clearFeilds();
            //5. calculate and update budget
            updateBudget();

            //6. Calculate and update percentages
            updatePercentages();
        }

        
    };

    var ctrlDeleteItem=function(event){
        var itemID,splitID,type,ID;
        console.log(event.target);
        itemID=(event.target.parentNode.parentNode.parentNode.parentNode.id);
        console.log(itemID);
        if(itemID){

            splitID=itemID.split('-');
            type=splitID[0];
            ID= parseInt(splitID[1]);

            //1. delete item from datastructure
            budgetctrl.deleteItem(type,ID);
            console.log(ID,type);

            //2. delete item from UI
            UIctrl.deleteListItems(itemID);
            //3. update and show the budget
            updateBudget();
        }
    };


    return {
        init:function(){
            console.log("the application has started");
            UIctrl.displayMonth();
            UIctrl.displayBudget({
                budget: 0,
                totalInc:0,
                totalExp:0,
                percentage: -1
            });
            setupEventListners();
        }
    };

})(budgetController,UIcontroller);

controller.init();



















