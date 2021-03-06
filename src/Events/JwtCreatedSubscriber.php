<?php

namespace App\Events;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        $data = $event->getData();
        $data['id'] = $user->getId();
        $data['name'] = $user->getName();
        $data['isActive'] = $user->getIsActive();

        $event->setData($data);
    }
}
