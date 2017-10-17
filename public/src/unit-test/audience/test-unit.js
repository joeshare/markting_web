/**
 * Author LLJ
 * Date 2016-8-19 17:44
 */
QUnit.module( "Audience Module", {
    beforeEach: function( assert ) {
        this.main = new controller( );
        console.log("beforeEach")
    },
    afterEach: function( assert ) {
        console.log("afterEach")
    }
});

QUnit.test("Test Fun", function(assert) {
    var res={
        code:0,
        data:[{}]
    };
    assert.ok(notEmptyRespose(res),'回数不为空');


    var arr=[1,2,3,4];
    formatter.delDataInArr(arr,3)
    assert.deepEqual(arr,[1,2,4], "删除成功" );
    assert.ok(formatter.isSameName(arr,4));
    var data={
        "segment_name":1,
        "publish_status":1,
        "oper":1,
        "updatetime":1,
        "id":1
    };
    var res={
        name:1,
        release:1,
        dateTime:1,
        oper:1,
        id:1
    };
    assert.deepEqual(formatter.headerInfo(data),res,'头信息格式正确');
});
QUnit.test("queryHeaderInfo", function(assert) {
    assert.expect();
    var done = assert.async();
    this.main.queryHeaderInfo(17,function(res){
        console.log("--------------")
        console.log(res.code)
        console.log(res)
        assert.ok(!res.code);
        done();
    })
});





