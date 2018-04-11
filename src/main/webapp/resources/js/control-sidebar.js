$(function () {

    'use strict'

    /**
     * Get access to plugins
     */

    $('[data-toggle="control-sidebar"]').controlSidebar()
    $('[data-toggle="push-menu"]').pushMenu()


    var $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu')
    var $controlSidebar = $('[data-toggle="control-sidebar"]').data('lte.controlsidebar')


    function changeLayout(cls) {
        $('body').toggleClass(cls)
        if ($('body').hasClass('fixed') && cls == 'fixed') {
            $pushMenu.expandOnHover()
        }
        $controlSidebar.fix()
    }


    /**
     * Get a prestored setting
     *
     * @param String name Name of of the setting
     * @returns String The value of the setting | null
     */
    function get(name) {
        if (typeof (Storage) !== 'undefined') {
            return localStorage.getItem(name)
        } else {
            console.warn('LocalStorage not available for your browser. Layout customization will not work.')
        }
    }

    /**
     * Store a new settings in the browser
     *
     * @param String name Name of the setting
     * @param String val Value of the setting
     * @returns void
     */
    function store(name, val) {
        if (typeof (Storage) !== 'undefined') {
            localStorage.setItem(name, val)
        } else {
            console.warn('LocalStorage not available for your browser. Layout customization will not work.')
        }
    }

    function updateSidebarSkin(sidebarSkin) {
        var $sidebar = $('.control-sidebar');
        var sidebarSkinCkbox = $('#sidebar-skin span.ui-chkbox-icon');
        if (sidebarSkin == 'control-sidebar-light') {
            $sidebar.removeClass('control-sidebar-dark');
            sidebarSkinCkbox.addClass('ui-icon-blank');
            sidebarSkinCkbox.removeClass('ui-icon-check');
            sidebarSkinCkbox.parent().removeClass('ui-state-active');
        } else {
            $sidebar.removeClass('control-sidebar-light');
            sidebarSkinCkbox.addClass('ui-icon-check');
            sidebarSkinCkbox.removeClass('ui-icon-blank');
            sidebarSkinCkbox.parent().addClass('ui-state-active');
        }

        $sidebar.addClass(sidebarSkin);

        store('layout.sidebar-skin', sidebarSkin);
    }


    function updateSidebarToggle(sidebarControlOpen) {

        var sidebarOpenCkbox = $('#sidebar-toggle span.ui-chkbox-icon');
        if (sidebarControlOpen === true || sidebarControlOpen === 'true') {
            sidebarOpenCkbox.addClass('ui-icon-check');
            sidebarOpenCkbox.removeClass('ui-icon-blank');
            sidebarOpenCkbox.parent().addClass('ui-state-active');
            $('.control-sidebar').addClass('control-sidebar-open');
            $('body').addClass('control-sidebar-open');
        } else {
            sidebarOpenCkbox.addClass('ui-icon-blank');
            sidebarOpenCkbox.removeClass('ui-icon-check');
            sidebarOpenCkbox.parent().removeClass('ui-state-active');
            $('.control-sidebar').removeClass('control-sidebar-open')
            $('body').removeClass('control-sidebar-open');
        }

        store('layout.sidebar-control-open', sidebarControlOpen);

    }


    function loadSidebarExpand() {
        var expandOnHover = get('layout.sidebar-expand-hover');
        var sidebarExpandCkbox = $('#sidebar-expand-hover span.ui-chkbox-icon');
        if (expandOnHover === true || expandOnHover === 'true') {
            PF('sidebarExpand').input.click();
            $pushMenu.expandOnHover();
            collapseSidebar();
            sidebarExpandCkbox.removeClass('ui-icon-blank');
            sidebarExpandCkbox.addClass('ui-icon-check');
            sidebarExpandCkbox.parent().addClass('ui-state-active');
            return;
        }
    }

    function updateSidebarExpand() {
        var expandOnHover = PF('sidebarExpand').input.is(':checked');
        var sidebarExpandCkbox = $('#sidebar-expand-hover span.ui-chkbox-icon');

        if (expandOnHover) {
            $pushMenu.expandOnHover();
            collapseSidebar();
        } else {
            sidebarExpandCkbox.addClass('ui-icon-blank');
            sidebarExpandCkbox.removeClass('ui-icon-check');
            sidebarExpandCkbox.parent().removeClass('ui-state-active');
            expandSidebar();
            $('[data-toggle="push-menu"]').data('lte.pushmenu', null); //not working, see https://github.com/almasaeed2010/AdminLTE/issues/1843#issuecomment-379550396
            $('[data-toggle="push-menu"]').pushMenu({expandOnHover: false});
            $pushMenu = $('[data-toggle="push-menu"]').data('lte.pushmenu');
        }

        store('layout.sidebar-expand-hover', expandOnHover);

    }


    /**
     * Retrieve default settings and apply them to the template
     *
     * @returns void
     */
    function setup() {

        var sidebarSkin = get('layout.sidebar-skin');

        if (!sidebarSkin) {
            sidebarSkin = 'control-sidebar-dark';
        }

        updateSidebarSkin(sidebarSkin);

        updateSidebarToggle(get('layout.sidebar-control-open'));

        loadSidebarExpand();


        // Add the layout manager
        $('[data-layout]').on('click', function () {
            changeLayout($(this).data('layout'))
        });

        $('#sidebar-skin').on('click', function () {
            var sidebarSkin;
            if ($('.control-sidebar').hasClass('control-sidebar-dark')) {
                sidebarSkin = 'control-sidebar-light'
            } else {
                sidebarSkin = 'control-sidebar-dark';
            }
            setTimeout(function () {
                updateSidebarSkin(sidebarSkin);
            }, 20);
        });

        $('#sidebar-toggle .ui-chkbox-box, #sidebar-toggle-label').on('click', function () {
            setTimeout(function () {
                changeLayout('control-sidebar-open');
                updateSidebarToggle($('body').hasClass('control-sidebar-open'));
            }, 20);

        });

        $('#sidebar-expand-hover .ui-chkbox-box, #sidebar-expand-hover-label').on('click', function () {
            setTimeout(function () {
                updateSidebarExpand();
            }, 20);

        });

        //  Reset options
        if ($('body').hasClass('fixed')) {
            $('[data-layout="fixed"]').attr('checked', 'checked')
        }
        if ($('body').hasClass('layout-boxed')) {
            $('[data-layout="layout-boxed"]').attr('checked', 'checked')
        }
        if ($('body').hasClass('sidebar-collapse')) {
            $('[data-layout="sidebar-collapse"]').attr('checked', 'checked')
        }

        $('#content').click(function () {
            $('.control-sidebar').removeClass('control-sidebar-open');
        })

        if ($('body').hasClass('layout-top-nav')) {
            $('#horizontal-layout').prop('checked', false);
        } else {
            $('#horizontal-layout').prop('checked', true);
        }

    }


    $(document).on("pfAjaxComplete", function () {
        setTimeout(function () {
            setup();
        }, 20);
    });


    $(document).ready(function () {
        setTimeout(function () {
            setup();
        }, 20);
    });


});

