import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda - Formulario */}
      <div className="w-full lg:w-[45%] bg-seconday flex items-center justify-center p-8">
        <LoginForm />
      </div>

      {/* Sección derecha - Imagen de fondo */}
      <div className="hidden lg:block lg:w-[55%] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/football-field.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay oscuro para mejor contraste */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        {/* Aquí puedes colocar tu imagen de campo de fútbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center z-10">
            <p className="text-lg opacity-80">Welcome to the Game</p>
          </div>
        </div>
      </div>
    </div>
  );
}

