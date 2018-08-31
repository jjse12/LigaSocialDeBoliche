@extends('layouts.guest')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div class="card bg-semi-transparent-gradient-primary">
                <div class="card-header text-white">Restablecer contraseña</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <p class="mb-5 text-white">Por favor ingresa tu correo electrónico. Se te enviará un link para que puedas restablecer tu contraseña</p>
                    <form method="POST" action="{{ route('password.email') }}" aria-label="{{ __('Reset Password') }}">
                        @csrf

                        <div class="form-group row">
                            <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 offset-xl-2 offset-lg-2 offset-md-2">
                                <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}"
                                       placeholder="Correo electrónico" name="email" value="{{ old('email') }}" required>

                                @if ($errors->has('email'))
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $errors->first('email') }}</strong>
                                    </span>
                                @endif
                            </div>
                        </div>

                        <div class="form-group row">
                            <div class="col-xl-8 col-lg-8 col-md-8 col-sm-12 offset-xl-2 offset-lg-2 offset-md-2">
                                <button type="submit"  class="col-12 btn btn-accent-dark btn-lg">Enviar link</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
