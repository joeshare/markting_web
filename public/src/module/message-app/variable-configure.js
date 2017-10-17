/**
 * Created by AnThen on 2016/12/12.
 * 变量配置
 */

class variableConfigure extends React.Component{
    choiceChange(id,code,name,materialId,materialType,materialName){
        let thisValue,choice = [];
        thisValue = materialName+'—'+name;
        choice[0] = {
            id:id,code:code,name:name,
            materialId:materialId,materialType:materialType,materialName:materialName,
            value:thisValue
        };
        this.setState({material:choice});
        $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').removeClass('disable');
    }
    optionChange(id,code,name,materialId,materialType,materialName){
        let tabList = this.state.tabType,tabActive = [];
        let materialList = this.state.materialList,addmaterialList = {},addTrue = false;
        for(let i=0; i<tabList.length; i++){
            if(tabList[i].type == materialType){tabActive = materialList;break;}
        }
        if(tabActive.length > 0){
            for(let i=0; i<tabActive.length; i++){
                if(id == tabActive[i].id){
                    addTrue = false;
                    break;
                }else{
                    addTrue = true;
                }
            }
        }else{addTrue = true;}
        if(addTrue){
            addmaterialList = {
                id:id,code:code,name:name,
                materialId:materialId,materialType:materialType,materialName:materialName
            };
            materialList.splice(materialList.length,0,addmaterialList);
            console.log(materialList)
            this.setState({materialList:materialList});
        }
        $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').addClass('disable');
    }
    tabsChange(tabType){
        let tabList = this.state.tabType;
        for(let i=0; i<tabList.length; i++){
            tabType==tabList[i].type ? tabList[i].csl=' active' : tabList[i].csl='';
        }
        this.setState({tabType:tabList});
        this.fetch(tabType);
    }
    fetchMaterial(){
        let masterThisVariable = this.props.masterThis.state.variable;
        let choice = [],choiceValue;
        for(let i=0; i<masterThisVariable.length; i++){
            if(this.props.nom == masterThisVariable[i].nom){
                if(masterThisVariable[i].listId != ''){
                    choiceValue = masterThisVariable[i].tabName+'—'+masterThisVariable[i].listName;
                    choice[0] = {
                        id:masterThisVariable[i].listId,
                        code:masterThisVariable[i].listCode,
                        name:masterThisVariable[i].listName,
                        materialId:masterThisVariable[i].tabId,
                        materialType:masterThisVariable[i].tabType,
                        materialName:masterThisVariable[i].tabName,
                        value:choiceValue
                    };
                    this.setState({material:choice});
                }
            }
        }
    }
    fetch(type){
        //coupon-variable.json
        let masterThisVariable = this.props.masterThis.state.variable;
        let material = false;
        let that = this, existing = [],existingI = 0, aptotic = [],materialId,materialName;
        let thisData = [],newThisData = [];

        for(let i=0; i<(this.state.tabType).length; i++){
            if(this.state.tabType[i].type == type){
                materialId = this.state.tabType[i].id;
                materialName = this.state.tabType[i].name;
            }
        }
        util.api({
            data: {
                method: 'mkt.material.coupon.properties',
                id: 1
            },
            success: function (res) {
                if(res.code == 0){
                    thisData = res.data;
                    for(let i=0; i<masterThisVariable.length; i++){
                        if(masterThisVariable[i].listId != ''){
                            existing[existingI] = {
                                tabType : masterThisVariable[i].tabType,
                                listId : masterThisVariable[i].listId
                            };
                            existingI++;
                        }
                    }
                    for(let i=0; i<masterThisVariable.length; i++){
                        if(that.props.nom == masterThisVariable[i].nom){
                            if(masterThisVariable[i].listId != ''){
                                material = {
                                    id:masterThisVariable[i].listId,
                                    type:masterThisVariable[i].tabType,
                                };
                            }
                        }
                    }
                    if(material){
                        $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').removeClass('disable');
                    }else{
                        $('#variableConfigureHtml').children('.modal-footer').children('.btn-content').children('#window-btn-0').addClass('disable');
                    }
                    if(existing.length > 0){
                        newThisData = thisData;
                        for(let i=0; i<existing.length; i++){
                            for(let j=0; j<thisData.length; j++){
                                if(existing[i].listId == thisData[j].id){
                                    newThisData.splice(j,1);
                                }
                            }
                        }
                        for(let j=0; j<newThisData.length; j++){
                            aptotic[j] = {
                                id:newThisData[j].id,code:newThisData[j].code,name:newThisData[j].name,
                                materialId:materialId,materialType:type,materialName:materialName
                            };
                        }
                    }else{
                        for(let j=0; j<thisData.length; j++){
                            aptotic[j] = {
                                id:thisData[j].id,code:thisData[j].code,name:thisData[j].name,
                                materialId:materialId,materialType:type,materialName:materialName
                            };
                        }
                    }
                    that.setState({nom:that.props.nom,materialList:aptotic});
                }
            }
        });
    };
    constructor(props){
        super(props);
        this.state = {
            nom:'',
            tabType: [{id:1,type:'coupon',name:'优惠券',csl:' active'}],
            material:[],
            materialList:[]
        };
        /*
         tabType: [{id:1,type:'coupon',name:'优惠券',csl:' active'}],
        */
    }
    componentDidMount(){
        this.fetch('coupon');
        this.fetchMaterial();
    }
    render() {
        return (
            <div className="variable-configure-html">
                <div className="header">变量：&#36;{this.props.nom}</div>
                <div className="choice-area">
                    <div className="choice-icon iconfont">&#xe66f;</div>
                    <div className="choice-box" id="variable-configure-choice-box">
                        {this.state.material.map((m,i)=> {
                            return (
                                <div className="choice" onClick={this.optionChange.bind(this,m.id,m.code,m.name,m.materialId,m.materialType,m.materialName)} data-nom={this.state.nom} data-id={m.id} data-name={m.name} data-code={m.code} data-material-id={m.materialId} data-material-type={m.materialType} data-material-name={m.materialName}>
                                    <div className="name">{m.value}</div>
                                    <div className="icon iconfont">&#xe610;</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="material-box">
                    <div className="tag-area">
                        <div className="tab-box">
                            {this.state.tabType.map((m,i)=> {
                                return (
                                    <div className={"tab"+m.csl} onClick={this.tabsChange.bind(this,m.type)}>{m.name}</div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="option-box">
                        {this.state.materialList.map((m,i)=> {
                            return (
                                <div className="option" onClick={this.choiceChange.bind(this,m.id,m.code,m.name,m.materialId,m.materialType,m.materialName)}>
                                    <div className="name">{m.name}</div>
                                    <div className="icon"></div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
module.exports = variableConfigure;