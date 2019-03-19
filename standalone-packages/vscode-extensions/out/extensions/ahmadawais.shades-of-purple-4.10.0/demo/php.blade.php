{{--
	TODO:
	1. Install "Laravel Blade Snippets" extension for syntax support
	2. Select Laravel Blade (blade) language for this file
--}}

<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Laravel</title>

	<!-- Fonts -->
	<link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">

	<!-- Styles -->
	<style>
		html,
		body {
			background-color: #fff;
			color: #636b6f;
			font-family: 'Nunito', sans-serif;
			font-weight: 200;
			height: 100vh;
			margin: 0;
		}

		.full-height {
			height: 100vh;
		}

		.flex-center {
			align-items: center;
			display: flex;
			justify-content: center;
		}

		.position-ref {
			position: relative;
		}

		.top-right {
			position: absolute;
			right: 10px;
			top: 18px;
		}

		.content {
			text-align: center;
		}

		.title {
			font-size: 84px;
		}

		.links > a {
			color: #636b6f;
			padding: 0 25px;
			font-size: 12px;
			font-weight: 600;
			letter-spacing: .1rem;
			text-decoration: none;
			text-transform: uppercase;
		}

		.m-b-md {
			margin-bottom: 30px;
		}
	</style>
</head>

<body>
	<div class="flex-center position-ref full-height">
		@if (Route::has('login'))
		<div class="top-right links">
			@auth
			<a href="{{ url('/home') }}">Home</a> @else
			<a href="{{ route('login') }}">Login</a>
			<a href="{{ route('register') }}">Register</a> @endauth
		</div>
		@endif

		<div class="content">
			<div class="title m-b-md">
				Laravel
			</div>

			<div class="links">
				<a href="https://laravel.com/docs">Documentation</a>
				<a href="https://laracasts.com">Laracasts</a>
				<a href="https://laravel-news.com">News</a>
				<a href="https://nova.laravel.com">Nova</a>
				<a href="https://forge.laravel.com">Forge</a>
				<a href="https://github.com/laravel/laravel">GitHub</a>
			</div>
		</div>
	</div>
</body>

</html>

{{-- Record --}}
@empty($record)
	<p>Dummy text.</p>
@endempty

{{-- Sections --}}
@section('content')
	<p>Dummy text.</p>
@endsection

{{-- More --}}
@if (is_array($message))
	<p>Dummy text.</p>
@else
	<p>Dummy text.</p>
@endif

{{-- Basic --}}
Hello, {{ $name }}.
Hello, {!! $name !!}.
<h1>Laravel</h1>

{{-- More --}}
@verbatim
<div class="container">
	Hello, {{ name }}.
</div>
@endverbatim

{{-- More --}}
@unless (Auth::check())
    You are not signed in.
@endunless

{{-- More --}}
@hasSection('navigation')
    <div class="pull-right">
        @yield('navigation')
    </div>

    <div class="clearfix"></div>
@endif

{{-- Switch --}}
@switch($i)
    @case(1)
        First case...
        @break

    @case(2)
        Second case...
        @break

    @default
        Default case...
@endswitch

{{-- Loop --}}
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor

@foreach ($users as $user)
    <p>This is user {{ $user->id }}</p>
@endforeach

@forelse ($users as $user)
    <li>{{ $user->name }}</li>
@empty
    <p>No users</p>
@endforelse

@while (true)
    <p>I'm looping forever.</p>
@endwhile

@foreach ($users as $user)
    @if ($user->type == 1)
        @continue
    @endif

    <li>{{ $user->name }}</li>

    @if ($user->number == 5)
        @break
    @endif
@endforeach


{{-- Service Injection --}}
@inject('metrics', 'App\Services\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
