@extends('layouts.guest')

@section('content')
<main class="pt-4">
    <div class="col-lg-4 col-xl-4 col-md-4 offset-xl-4 offset-lg-4 offset-md-4 py-5 bg-semi-transparent-gradient-primary">
        <div class="row">
            <div class="col-12 text-center text-white">
                <h3 class="text-twitter">¡Ingresa con tu cuenta!</h3>
                <p class="mb-4">
                    Al continuar aceptas nuestros <a class="text-white" target="_blank" href=""><u><i>terminos y condiciones</i></u></a>
                </p>
            </div>
        </div>
        <form method="POST" action="{{ route('login') }}" aria-label="{{ __('Login') }}">
            @csrf
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-8 col-sm-10">
                    <div class="form-group">
                        <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}"
                               placeholder="Correo electrónico" name="email" value="{{ old('email') }}" required autofocus>
                        @if ($errors->has('email'))
                            <span class="invalid-feedback" role="alert">
                                <strong>{{ $errors->first('email') }}</strong>
                            </span>
                        @endif
                    </div>
                    <div class="form-group">
                        <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}"
                               placeholder="Contraseña" name="password" required>
                    </div>
                    <div class="form-group row">
                        <div class="col-md-6 offset-md-4">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                                <label class="form-check-label text-light" for="remember">Recordarme</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-lg btn-block text-light">Iniciar Sesión</button>
                    </div>
                </div>
            </div>
        </form>
        <div class="row justify-content-md-center">
            <div class="col-12 text-center text-white">
                <a class="btn btn-link text-light" href="{{ route('password.request') }}">
                    ¿Olvidaste tu contraseña?
                </a>
            </div>
        </div>
    </div>
</main>
@endsection
