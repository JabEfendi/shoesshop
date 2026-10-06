<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'ShoeShop') }}</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=roboto:400,500,700|oswald:500,600,700" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2.0/dist/css/adminlte.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
    <style>
        body { font-family: 'Roboto', sans-serif; background: #f4f6f9; }
        .content-wrapper { margin-left: 0 !important; }
        .main-sidebar { display: none; }
        .brand-link.industrial {
            background: #181714 !important;
            border-bottom: 3px solid #a7671f;
        }
        .card-configurator {
            border-top: 3px solid #a7671f;
            box-shadow: 0 4px 14px 0 rgba(24,23,20,0.25);
        }
        .swatch-color {
            width: 32px; height: 32px; border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 2px 4px rgba(0,0,0,.15);
            cursor: pointer; transition: transform .15s;
        }
        .swatch-color:hover { transform: scale(1.1); }
        .swatch-color.active { box-shadow: 0 0 0 3px #a7671f; transform: scale(1.15); }
        .option-card {
            cursor: pointer; border: 2px solid transparent;
            transition: all .15s;
        }
        .option-card:hover { border-color: #cac6bf; }
        .option-card.active {
            border-color: #a7671f;
            background: #fff9f1;
        }
        .price-line-through { text-decoration: line-through; color: #888; font-weight: 400; }
        .total-price-box {
            background: linear-gradient(135deg, #22201c 0%, #302d29 100%);
            color: #fff; padding: 18px; border-radius: 6px;
            border-left: 4px solid #cb8f4b;
        }
        .total-price { font-family: 'Oswald', sans-serif; font-size: 2.2rem; color: #ffb74d; }
        .btn-industrial-primary {
            background: linear-gradient(135deg,#a7671f 0%,#8b4e11 100%);
            color: #fff; border: 0; font-weight: 600;
            text-transform: uppercase; letter-spacing: .5px;
        }
        .btn-industrial-primary:hover { background: #8b4e11; color: #fff; box-shadow: 0 6px 18px rgba(139,78,17,.35); }
        .canvas-wrap-3d {
            position: relative; height: 70vh; min-height: 520px; width: 100%;
            background: radial-gradient(ellipse at 50% 80%, #e9e7e3 0%, #cac6bf 50%, #a8a298 100%);
            overflow: hidden; border-radius: 6px;
        }
        .canvas-wrap-3d.loading::before {
            content: "Memuat model 3D...";
            position: absolute; inset: 0; display: flex;
            align-items: center; justify-content: center;
            font-size: 1.1rem; color: #454039; font-weight: 500;
            background: rgba(255,255,255,0.45); backdrop-filter: blur(4px);
            z-index: 10;
        }
        .loading-bar {
            position: absolute; top: 0; left: 0; height: 4px;
            background: linear-gradient(90deg, #a7671f, #ffb74d);
            transition: width .25s; z-index: 11;
        }
    </style>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body class="sidebar-mini layout-fixed">
    <div class="wrapper">
        <nav class="main-header navbar navbar-expand navbar-dark" style="background:#181714;border-bottom:3px solid #a7671f;">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link brand-link industrial d-inline-block px-3 py-2 text-white text-uppercase font-weight-bold"
                       href="{{ route('products.index') }}"
                       style="letter-spacing:1.5px;">
                        <i class="fas fa-boot mr-2"></i> SHOESHOP<span style="color:#ffb74d;">3D</span>
                    </a>
                </li>
            </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item d-none d-md-inline-block">
                    <span class="nav-link text-industrial-200 text-sm">
                        <i class="fas fa-cogs mr-1 text-warning"></i>
                        Custom Configurator v1.0
                    </span>
                </li>
            </ul>
        </nav>

        <div class="content-wrapper px-3 py-4">
            <section class="content">
                @inertia
            </section>
        </div>

        <footer class="main-footer text-sm" style="background:#181714;color:#a8a298;border-top:2px solid #454039;margin-left:0;">
            <strong>© {{ date('Y') }} ShoeShop 3D Configurator.</strong> Built with Laravel + React Three Fiber
            <div class="float-right d-none d-sm-inline">
                Tema Industrial · AdminLTE 3.x compatible
            </div>
        </footer>
    </div>
</body>
</html>
