<div id="channel_distribution_public_template">
    <ul>
        <li>分配渠道经理</li>
        <li>投放公开任务</li>
    </ul>
    <div class="content">
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
                                    <input type="checkbox" value="{{item.id}}" class="hand" />
                                    <span>{{item.name}} - </span>
                                    <span>{{item.provinceName}}</span>
                                </div>
                                {{/each}}
                            </div>
                        </form>
                    </td>
                </tr>
            </table>
        </div>
        <div class="public hide">
            <p>确定将该任务进行公开吗？</p>
            <p>公开后的任务将所有在职捕头可见</p>
        </div>
    </div>
</div>