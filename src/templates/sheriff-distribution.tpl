<div id="distribution_public_template">
    <div style="width:460px;">
        <table>
            <tr>
                <td>
                    <p class="pull-left">分配捕头</p>
                    <label style="float: right;">
                        全选
                        <input type="checkbox" id="checkAll">
                    </label>
                    <div class="clearfix"></div>
                    <hr />
                    <form id="distribution_public_form">
                        <div class="divied-type" style="height: 300px;overflow-y: auto;text-align: left;">
                            {{each list item index}}
                            <div>
                                <input type="checkbox" value="{{item.id}}" class="hand"/>
                                <span>{{item.name}} - </span>
                                <span>{{stateToString(item.type)}}</span>
                                <span>{{if item.isRefuse}}-拒绝{{/if}}</span>
                            </div>
                            {{/each}}
                        </div>
                    </form>
                </td>
            </tr>
        </table>
    </div>
</div>
