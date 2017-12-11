<div id="channel_distribution_public_template">
    <ul class="qd-distribution-tab">
        <li class="active">分配渠道经理</li>
        <li>投放公开任务</li>
    </ul>
    <div class="content">
        <div style="width:460px;">
            <table>
                <tr>
                    <td>
                        <form id="distribution_public_form">
                            <div id="qd-distribution-tab0" class="divied-type" style="height:300px;overflow-y:auto;text-align:left;">
                                {{each list item index}}
                                <div>
                                    <input type="radio" name="channel-list" value="{{item.id}}" data-name="{{item.name}}" class="hand" />
                                    <span>{{item.name}} - </span>
                                    <span>
                                    {{each item.operatorProvinceVoList temp i}}
                                        {{temp.provinceName}},
                                    {{/each}}
                                    </span>
                                </div>
                                {{/each}}
                            </div>
                            <div id="qd-distribution-tab1" class="public hide" style="height: 200px;font-size: 18px;padding-top: 100px">
                                <p>确定将该任务进行公开吗？<br> 公开后的任务将所有在职捕头可见</p>
                            </div>
                        </form>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</div>